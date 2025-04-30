"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddWebsiteForm } from "@/components/AddWebsiteForm";
import { WebsiteListItem } from "@/components/WebsiteListItem";
import { type Website } from "@/types";
import { checkWebsiteStatus } from "@/services/uptime-checker"; // Assume this exists and works
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

// Mock Local Storage Hook (Replace with actual DB/API calls later)
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
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
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      const statusResult = await checkWebsiteStatus(website.url);
      setWebsites(prev =>
        prev.map(w =>
          w.id === website.id
            ? {
                ...w,
                status: statusResult.isUp ? 'up' : 'down',
                statusCode: statusResult.statusCode,
                lastCheck: new Date(),
                error: !statusResult.isUp ? `HTTP ${statusResult.statusCode}` : null,
              }
            : w
        )
      );
    } catch (error: any) {
      console.error(`Error checking ${website.url}:`, error);
      setWebsites(prev =>
        prev.map(w =>
          w.id === website.id
            ? {
                ...w,
                status: 'error',
                lastCheck: new Date(),
                error: error.message || "Failed to fetch status",
              }
            : w
        )
      );
      toast({
        variant: "destructive",
        title: `Error Checking ${website.url}`,
        description: error.message || "Could not retrieve status.",
      });
    } finally {
      setIsChecking(prev => ({ ...prev, [website.id]: false }));
    }
  }, [setWebsites, toast]); // Include dependencies

  // Initial load and periodic checks
  useEffect(() => {
    setIsLoading(true);
    const initialChecks = websites.map(checkAndUpdateStatus);
    Promise.all(initialChecks).finally(() => setIsLoading(false));

    // Set up interval for periodic checks (e.g., every 5 minutes for now)
    // This is a basic implementation. Real-world would need more robust scheduling.
    const intervalId = setInterval(() => {
      console.log("Running periodic checks...");
      websites.forEach(checkAndUpdateStatus);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Run only on mount initially, subsequent checks handled by interval & dependency changes


  const handleAddWebsite = async (url: string) => {
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
    };

    // Add optimistically first
    setWebsites(prev => [...prev, newWebsite]);

    // Then check status
    try {
       await checkAndUpdateStatus(newWebsite);
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
    // Simulate delete delay
    setTimeout(() => {
      setWebsites(prev => prev.filter(w => w.id !== id));
      toast({
        title: "Website Removed",
        description: `Monitoring stopped for the website.`,
      });
      setIsDeleting(null);
    }, 500); // Simulate API call delay
  };

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">AlwaysUp</h1>
        <p className="text-muted-foreground">Simple Website Uptime Monitoring</p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <AddWebsiteForm onAddWebsite={handleAddWebsite} isLoading={isLoading && !websites.length} />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monitored Websites</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !websites.length ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
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
                  isDeleting={isDeleting === website.id || isChecking[website.id]}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AlwaysUp. Built with Next.js & ShadCN UI.</p>
        <p className="mt-1">Free tier limited to 5 monitors. Upgrade for more!</p>
      </footer>
    </main>
  );
}
