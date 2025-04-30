'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { checkWebsiteStatusReal } from '@/server/services/uptime';
import { MAX_HISTORY_LENGTH } from './page'; // Import constant

// --- Schemas ---

const AddWebsiteSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

const DeleteWebsiteSchema = z.object({
  id: z.string().cuid({ message: "Invalid website ID" }),
});

const CheckWebsiteSchema = z.object({
  id: z.string().cuid({ message: "Invalid website ID" }),
  url: z.string().url(),
});


// --- Server Actions ---

/**
 * Adds a new website to monitor. Performs an initial check.
 */
export async function addWebsite(formData: FormData) {
  const rawFormData = {
    url: formData.get('url'),
  };

  const validatedFields = AddWebsiteSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid URL format.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { url } = validatedFields.data;

   // Check limit (replace with user/plan specific logic later)
   const currentCount = await prisma.website.count();
   const FREE_TIER_LIMIT = 5; // Move to config later
   if (currentCount >= FREE_TIER_LIMIT) {
     return { error: `Free tier limit of ${FREE_TIER_LIMIT} monitors reached.` };
   }


  // Check if URL already exists
  const existingWebsite = await prisma.website.findUnique({
    where: { url },
  });

  if (existingWebsite) {
    return { error: `${url} is already being monitored.` };
  }

  try {
    // 1. Create the website entry first with 'checking' status
    const newWebsite = await prisma.website.create({
      data: {
        url: url,
        status: 'checking',
      },
    });

    // 2. Perform the initial check
    const checkResult = await checkWebsiteStatusReal(url);
    const checkTimestamp = new Date();

    // 3. Create the first check history record
    await prisma.websiteCheck.create({
      data: {
        websiteId: newWebsite.id,
        timestamp: checkTimestamp,
        status: checkResult.isUp ? 'up' : checkResult.error ? 'error' : 'down',
        statusCode: checkResult.statusCode,
        error: checkResult.error,
        duration: checkResult.duration,
      },
    });

    // 4. Update the website entry with the initial check result
    await prisma.website.update({
      where: { id: newWebsite.id },
      data: {
        status: checkResult.isUp ? 'up' : checkResult.error ? 'error' : 'down',
        lastCheck: checkTimestamp,
        statusCode: checkResult.statusCode,
        error: checkResult.error,
      },
    });

    revalidatePath('/'); // Revalidate the home page to show the new website
    return { success: `${url} added and initial check complete.` };

  } catch (error: any) {
    console.error("Error adding website:", error);
    // Attempt to clean up if creation failed partially
    if (error.code === 'P2002') { // Unique constraint failed (race condition?)
        return { error: `${url} is already being monitored (conflict).` };
    }
     // Basic cleanup if website was created but check failed severely
     const potentiallyCreated = await prisma.website.findUnique({ where: { url } });
     if (potentiallyCreated && !potentiallyCreated.lastCheck) {
         await prisma.website.delete({ where: { url } }).catch(e => console.error("Cleanup failed:", e));
     }
    return { error: `Failed to add website: ${error.message}` };
  }
}

/**
 * Deletes a monitored website and its history.
 */
export async function deleteWebsite(formData: FormData) {
    const rawFormData = { id: formData.get('id') };
    const validatedFields = DeleteWebsiteSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return { error: 'Invalid website ID.' };
    }

    const { id } = validatedFields.data;

    try {
        // Prisma relation cascade should handle deleting WebsiteCheck history
        await prisma.website.delete({
            where: { id },
        });
        revalidatePath('/'); // Update the list on the home page
        return { success: 'Website removed successfully.' };
    } catch (error: any) {
        console.error("Error deleting website:", error);
         if (error.code === 'P2025') { // Record to delete not found
            return { error: 'Website not found.' };
         }
        return { error: `Failed to remove website: ${error.message}` };
    }
}

/**
 * Manually triggers a status check for a specific website.
 * Updates the website record and adds a check history entry.
 * Prunes old history entries.
 */
export async function checkWebsiteNow(formData: FormData) {
    const rawFormData = { id: formData.get('id'), url: formData.get('url') }; // Get URL too
    const validatedFields = CheckWebsiteSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return { error: 'Invalid website ID or URL.' };
    }

    const { id, url } = validatedFields.data;

     // Optimistic UI update hint: Mark as 'checking' immediately on client
     // before calling this action if desired.

    try {
      // 1. Perform the check
      const checkResult = await checkWebsiteStatusReal(url);
      const checkTimestamp = new Date();
      const currentStatus = checkResult.isUp ? 'up' : checkResult.error ? 'error' : 'down';

       // 2. Use Prisma transaction for atomic update and history management
       await prisma.$transaction(async (tx) => {
          // a. Create the new check history record
          await tx.websiteCheck.create({
            data: {
              websiteId: id,
              timestamp: checkTimestamp,
              status: currentStatus,
              statusCode: checkResult.statusCode,
              error: checkResult.error,
              duration: checkResult.duration,
            },
          });

          // b. Update the main website record
          await tx.website.update({
            where: { id },
            data: {
              status: currentStatus,
              lastCheck: checkTimestamp,
              statusCode: checkResult.statusCode,
              error: checkResult.error,
            },
          });

          // c. Prune old history (keep only the latest MAX_HISTORY_LENGTH)
          const historyCount = await tx.websiteCheck.count({ where: { websiteId: id } });
          if (historyCount > MAX_HISTORY_LENGTH) {
              const recordsToDelete = await tx.websiteCheck.findMany({
                  where: { websiteId: id },
                  orderBy: { timestamp: 'asc' }, // Find the oldest records
                  take: historyCount - MAX_HISTORY_LENGTH, // Calculate how many to delete
                  select: { id: true } // Only select IDs for deletion
              });
              const idsToDelete = recordsToDelete.map(record => record.id);
              await tx.websiteCheck.deleteMany({
                  where: {
                      id: { in: idsToDelete }
                  }
              });
          }
       });


      revalidatePath('/'); // Update the UI
      return { success: `Check complete for ${url}. Status: ${currentStatus}` };

    } catch (error: any) {
      console.error(`Error checking website ${url} (ID: ${id}):`, error);
       // Optionally try to update status to 'error' even if transaction failed
       await prisma.website.update({ where: { id }, data: { status: 'error', error: 'Check execution failed' } }).catch();
       revalidatePath('/'); // Still revalidate to show potential error state
      return { error: `Failed to check website: ${error.message}` };
    }
}


/**
 * Fetches all monitored websites with their recent history.
 */
export async function getMonitoredWebsites() {
  try {
    const websites = await prisma.website.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        // Include the last N history records, ordered newest first
        history: {
          orderBy: { timestamp: 'desc' },
          take: MAX_HISTORY_LENGTH,
        },
      },
    });
    return websites;
  } catch (error: any) {
    console.error("Error fetching websites:", error);
    // In a real app, you might want to throw the error or return a specific error object
    return []; // Return empty array on error for now
  }
}
