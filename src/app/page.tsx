import * as React from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddWebsiteForm } from "@/components/AddWebsiteForm";
import { WebsiteListItem } from "@/components/WebsiteListItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";
import { getMonitoredWebsites } from "./actions"; // Import server action
import { prisma } from "@/server/db/prisma"; // Direct import for count

export const MAX_HISTORY_LENGTH = 10; // Store last 10 checks

// This page is now primarily a Server Component
export default async function Home() {
  // Fetch initial data on the server
  const websites = await getMonitoredWebsites();
  // Fetch count separately or derive from websites length if sufficient
  const websiteCount = await prisma.website.count(); // Example: direct count
  const FREE_TIER_LIMIT = 5; // Move to config later

  // No more client-side state management for the website list itself
  // No more useEffect for initial load or periodic checks (move logic to backend cron job)

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">AlwaysUp</h1>
        <p className="text-lg text-muted-foreground">
          Check your website uptime easily and reliably. Add URLs via the form below.
        </p>
        {/* Info about backend checking */}
         <p className="text-sm text-muted-foreground mt-2">
           Uptime checks are now performed by our server for reliability.
         </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          {/* The form now uses server actions */}
          <AddWebsiteForm currentMonitorCount={websiteCount} />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
           <CardTitle>Monitored Websites ({websiteCount}/{FREE_TIER_LIMIT} on Free Tier)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Render based on fetched data */}
          {websites.length === 0 ? (
             <Alert>
               <ServerCrash className="h-4 w-4" />
               <AlertTitle>No Websites Added Yet</AlertTitle>
               <AlertDescription>
                 Use the form above to start monitoring your first website.
               </AlertDescription>
             </Alert>
          ) : (
            <div>
              {/* Pass data down to Client Components */}
              {websites.map(website => (
                <WebsiteListItem
                  key={website.id}
                  website={website}
                  // onDelete and onCheck handlers are now inside WebsiteListItem, triggering server actions
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AlwaysUp. Built with Next.js, Prisma & Neon.</p>
        <p className="mt-1">
           Free tier limited to {FREE_TIER_LIMIT} monitors. {' '}
           <Link href="/pricing" className="underline text-primary hover:text-accent">
             View Pricing (INR)
           </Link>
           {' '} to upgrade.
         </p>
          <p className="mt-1 text-xs">
            Note: Periodic checks require a backend cron job (not implemented in this example). Manual checks work via the button.
          </p>
      </footer>
    </main>
  );
}
