
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddWebsiteForm } from "@/components/AddWebsiteForm";
import { WebsiteListItem } from "@/components/WebsiteListItem";
import { type Website, type WebsiteCheck } from "@/types"; // Import WebsiteCheck
import { checkWebsiteStatus } from "@/services/uptime-checker"; // Assume this exists and works
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

const MAX_HISTORY_LENGTH = 10; // Store last 10 checks

// Mock Local Storage Hook (Replace with actual DB/API calls later)
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Basic migration: if history is missing, add an empty array
      if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
             parsed.forEach(site => {
                 if (!site.history) {
                     site.history = [];
                 }
                 // Ensure date objects are correctly parsed from strings
                 if (site.lastCheck) site.lastCheck = new Date(site.lastCheck);
                 site.history.forEach((h: WebsiteCheck) => h.timestamp = new Date(h.timestamp));
             });
          }
         return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”:", error);
      return initialValue;
    }
  });

  useEffect(() => {
     if (typeof window !== "undefined") {
       try {
         window.localStorage.setItem(key, JSON.stringify(storedValue));
       } catch (error) {
         console.error("Error setting localStorage key “" + key + "”:", error);
       }
     }
  }, [key, storedValue]);


  return [storedValue, setStoredValue];
};


export default function Home() {
  const [websites, setWebsites] = useLocalStorage<Website[]>("monitoredWebsites", []);
  const [isLoading, setIsLoading] = useState(true); // For initial load and adding
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which item is being deleted
  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({}); // Track individual check status
  const { toast } = useToast();

  const checkAndUpdateStatus = useCallback(async (website: Website) => {
    setIsChecking(prev => ({ ...prev, [website.id]: true }));
    const checkTimestamp = new Date();
    let currentCheckResult: WebsiteCheck;

    try {
      const statusResult = await checkWebsiteStatus(website.url);
      currentCheckResult = {
        timestamp: checkTimestamp,
        status: statusResult.isUp ? 'up' : 'down',
        statusCode: statusResult.statusCode,
        error: !statusResult.isUp ? (statusResult.error || `HTTP ${statusResult.statusCode}`) : null,
      };

    } catch (error: any) {
      console.error(`Error checking ${website.url}:`, error);
      currentCheckResult = {
        timestamp: checkTimestamp,
        status: 'error',
        statusCode: null,
        error: error.message || "Failed to fetch status",
      };
      toast({
        variant: "destructive",
        title: `Error Checking ${website.url}`,
        description: currentCheckResult.error,
      });
    } finally {
        // Update website state with current check result and history
        setWebsites(prev =>
            prev.map(w =>
              w.id === website.id
                ? {
                    ...w,
                    status: currentCheckResult.status,
                    statusCode: currentCheckResult.statusCode,
                    lastCheck: currentCheckResult.timestamp,
                    error: currentCheckResult.error,
                    // Append new check to history, keep only the last MAX_HISTORY_LENGTH items
                    history: [currentCheckResult, ...(w.history || [])].slice(0, MAX_HISTORY_LENGTH),
                  }
                : w
            )
          );
      setIsChecking(prev => ({ ...prev, [website.id]: false }));
    }
  }, [setWebsites, toast]); // Include dependencies

  // Initial load check
  useEffect(() => {
      setIsLoading(true);
      // Filter out websites that already have a recent check to avoid unnecessary initial checks
      const websitesToCheck = websites.filter(w => !w.lastCheck || (new Date().getTime() - new Date(w.lastCheck).getTime()) > 60 * 1000); // Check if last check > 1 min ago
      const initialChecks = websitesToCheck.map(w => checkAndUpdateStatus(w));

      // Ensure history array exists for all websites after potential migration
      setWebsites(prev => prev.map(w => ({ ...w, history: w.history || [] })));

      Promise.all(initialChecks).finally(() => setIsLoading(false));
  }, []); // Run only on mount

  // Periodic checks effect
   useEffect(() => {
      // Only set interval if there are websites to check
      if (websites.length === 0) return;

      console.log("Setting up periodic checks...");
      const intervalId = setInterval(() => {
        console.log("Running periodic checks...");
        // Create check promises for all websites
        const checks = websites.map(website => checkAndUpdateStatus(website));
        Promise.all(checks).catch(err => console.error("Error during periodic check batch:", err));
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
         console.log("Clearing periodic checks interval.");
         clearInterval(intervalId); // Cleanup interval on unmount or when websites array changes
      }
    }, [websites, checkAndUpdateStatus]); // Re-run if websites array or check function changes


  const handleAddWebsite = async (url: string) => {
    // Limit free tier
    if (websites.length >= 5) {
       toast({
         variant: "destructive",
         title: "Free Tier Limit Reached",
         description: (
             <>
              You can monitor up to 5 websites on the free plan. {' '}
              <Link href="/pricing" className="underline text-accent-foreground font-medium">
                Upgrade
              </Link>
              {' '} for more monitors.
             </>
         ),
       });
       return;
     }

    // Prevent adding duplicates
    if (websites.some(w => w.url === url)) {
      toast({
        variant: "default",
        title: "Already Monitoring",
        description: `${url} is already being monitored.`,
      });
      return;
    }

    setIsLoading(true); // Indicate loading while adding/checking
    const newWebsite: Website = {
      id: crypto.randomUUID(), // Simple unique ID generation
      url,
      status: 'checking', // Initial status
      history: [], // Initialize with empty history
    };

    // Add optimistically first
    setWebsites(prev => [...prev, newWebsite]);

    // Then check status
    try {
       await checkAndUpdateStatus(newWebsite); // This will also add the first history entry
       toast({
         title: "Website Added",
         description: `${url} is now being monitored.`,
       });
    } finally {
        setIsLoading(false); // Stop loading indicator
    }
  };

  const handleDeleteWebsite = (id: string) => {
    setIsDeleting(id);
    // Simulate delete delay - replace with actual API call if backend exists
    setTimeout(() => {
      setWebsites(prev => prev.filter(w => w.id !== id));
      toast({
        title: "Website Removed",
        description: `Monitoring stopped for the website.`,
      });
      setIsDeleting(null);
    }, 300); // Shorter simulated delay
  };

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">AlwaysUp</h1>
        <p className="text-lg text-muted-foreground">
          Check your website uptime easily and reliably. Add your URLs below to get started.
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          {/* Pass the current number of websites to potentially disable add if limit reached */}
          <AddWebsiteForm onAddWebsite={handleAddWebsite} isLoading={isLoading && !websites.length} currentMonitorCount={websites.length} />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monitored Websites ({websites.length}/5 on Free Tier)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Initial Loading Skeleton */}
          {isLoading && !websites.length ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : websites.length === 0 ? (
             <Alert>
               <ServerCrash className="h-4 w-4" />
               <AlertTitle>No Websites Added Yet</AlertTitle>
               <AlertDescription>
                 Use the form above to start monitoring your first website.
               </AlertDescription>
             </Alert>
          ) : (
            <div>
              {websites.map(website => (
                <WebsiteListItem
                  key={website.id}
                  website={website}
                  onDelete={handleDeleteWebsite}
                  isDeleting={isDeleting === website.id || (isChecking[website.id] ?? false)} // Use loading state from checking too
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AlwaysUp. Built with Next.js & ShadCN UI.</p>
        <p className="mt-1">
           Free tier limited to 5 monitors. {' '}
           <Link href="/pricing" className="underline text-primary hover:text-accent">
             View Pricing (INR)
           </Link>
           {' '} to upgrade.
         </p>
      </footer>
    </main>
  );
}
