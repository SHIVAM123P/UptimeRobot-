"use client"; // This component needs interactivity

import * as React from "react";
import { useFormState, useFormStatus } from 'react-dom';
import { Trash2, ChevronDown, ChevronUp, History, RefreshCw } from "lucide-react"; // Added RefreshCw
import { formatDistanceToNow, format } from 'date-fns';
import type { Website as PrismaWebsite, WebsiteCheck as PrismaWebsiteCheck } from "@prisma/client"; // Import Prisma types
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { WebsiteStatusIndicator } from "@/components/WebsiteStatusIndicator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusDescription } from "@/lib/http-status-codes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteWebsite, checkWebsiteNow } from "@/app/actions"; // Import server actions
import { useToast } from "@/hooks/use-toast"; // For showing action results

// Combine Prisma types with potential frontend adjustments if needed
export interface WebsiteCheck extends PrismaWebsiteCheck {}
export interface Website extends PrismaWebsite {
  history?: WebsiteCheck[]; // Make history optional or ensure it's always included
}


interface WebsiteListItemProps {
  website: Website;
}

// --- Helper Components for Actions ---

function DeleteButton({ websiteUrl }: { websiteUrl: string }) {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction
      type="submit" // Important: Make the action button submit the form
      disabled={pending}
      className={cn(
        buttonVariants({ variant: "destructive" }),
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending ? "Deleting..." : "Delete"}
    </AlertDialogAction>
  );
}

function CheckNowButton({ websiteId, websiteUrl }: { websiteId: string, websiteUrl: string }) {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(checkWebsiteNow, null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state?.success) {
      // toast({ title: "Check Triggered", description: state.success }); // Optional success toast
    } else if (state?.error) {
      toast({ variant: "destructive", title: "Check Failed", description: state.error });
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="inline-block">
       <input type="hidden" name="id" value={websiteId} />
       <input type="hidden" name="url" value={websiteUrl} />
       <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Check status now"
          disabled={pending}
          className={cn("h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary", pending && "animate-spin")}
          title="Check Now"
       >
         <RefreshCw className="h-4 w-4" />
       </Button>
    </form>
  );
}


// --- Main Component ---

export function WebsiteListItem({ website }: WebsiteListItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { toast } = useToast();

  // State for delete action
  const [deleteState, deleteFormAction] = useFormState(deleteWebsite, null);

  // Effect for delete action feedback
  React.useEffect(() => {
    if (deleteState?.success) {
      toast({ title: "Website Removed", description: deleteState.success });
      // No need to manually remove from list, revalidation handles it
    } else if (deleteState?.error) {
      toast({ variant: "destructive", title: "Deletion Failed", description: deleteState.error });
    }
  }, [deleteState, toast]);


  // Calculate timeAgo only if lastCheck exists
  const timeAgo = website.lastCheck ? formatDistanceToNow(new Date(website.lastCheck), { addSuffix: true }) : 'never';

  const hasDetails = website.statusCode !== null || website.error || website.lastCheck || (website.history && website.history.length > 0);

  return (
    <Card className="mb-4 transition-shadow duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="flex flex-col p-0">
        {/* Main Row */}
        <div className="flex items-center justify-between p-4 gap-2">
          {/* Status and URL */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <WebsiteStatusIndicator
              status={website.status}
            />
            <div className="flex-1 min-w-0">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline break-all block truncate"
                title={website.url}
              >
                {website.url}
              </a>
               {/* Display last check time briefly */}
               <p className="text-xs text-muted-foreground mt-0.5">
                  Last check: {timeAgo}
               </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
              {/* Check Now Button */}
              <CheckNowButton websiteId={website.id} websiteUrl={website.url} />

             {/* Expand/Collapse Button */}
             {hasDetails && (
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setIsExpanded(!isExpanded)}
                 aria-expanded={isExpanded}
                 aria-controls={`details-${website.id}`}
                 aria-label={isExpanded ? "Collapse details" : "Expand details"}
                 className="h-8 w-8"
               >
                 {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
               </Button>
              )}

            {/* Delete Button Trigger */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 {/* The form status pending state will be managed by the DeleteButton via useFormStatus */}
                <Button variant="ghost" size="icon" aria-label="Delete website" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                 {/* Form for Delete Action */}
                 <form action={deleteFormAction}>
                   <input type="hidden" name="id" value={website.id} />
                   <AlertDialogHeader>
                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                     <AlertDialogDescription>
                       This action cannot be undone. This will permanently delete the monitor for <span className="font-medium break-all">{website.url}</span> and its history.
                     </AlertDialogDescription>
                   </AlertDialogHeader>
                   <AlertDialogFooter>
                     <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                      {/* The submit button using useFormStatus */}
                     <DeleteButton websiteUrl={website.url} />
                   </AlertDialogFooter>
                 </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
          <div id={`details-${website.id}`} className="bg-muted/50 px-4 py-3 border-t border-border text-sm text-muted-foreground space-y-3">
             {/* Current Status Summary */}
             <div className="space-y-1 pb-2 border-b border-border/50 mb-3">
                {website.lastCheck && (
                <p><strong>Last check:</strong> {timeAgo} ({format(new Date(website.lastCheck), 'PPpp')})</p>
                )}
                {website.statusCode !== null && website.statusCode !== undefined && (
                  <p><strong>Status Code:</strong>
                      <Badge
                       variant={website.status === 'up' ? 'green' : 'red'}
                       className="ml-2"
                      >
                      {website.statusCode}
                      </Badge>
                      <span className="ml-2 text-foreground/80">({getStatusDescription(website.statusCode) || 'Unknown Code'})</span>
                  </p>
                )}
                {website.error && (website.status === 'down' || website.status === 'error') && (
                  <p className="break-words"><strong>Error:</strong> <span className="text-destructive/90">{website.error}</span></p>
                )}
                {website.status === 'checking' && <p>Currently checking status...</p>}
             </div>

            {/* History Section */}
            {website.history && website.history.length > 0 ? (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <History className="h-4 w-4" /> Recent Checks
                </h4>
                <ScrollArea className="h-[150px] pr-3"> {/* Limit height and add scroll */}
                  <ul className="space-y-2">
                    {website.history.map((check) => (
                      <li key={check.id} className="flex justify-between items-start gap-2 text-xs border-b border-border/30 pb-1 last:border-b-0">
                        <div className="flex-1">
                           <span className="text-foreground/90 block">{format(new Date(check.timestamp), 'MMM d, HH:mm:ss')}</span>
                           {check.statusCode !== null && (
                                <Badge
                                variant={check.status === 'up' ? 'green' : check.status === 'error' ? 'yellow' : 'red'}
                                className="mr-1 mt-0.5"
                                >
                                {check.statusCode}
                                </Badge>
                           )}
                           <span className={cn("capitalize font-medium", {
                               'text-green-400': check.status === 'up',
                               'text-red-400': check.status === 'down',
                               'text-yellow-400': check.status === 'error',
                           })}>
                             {check.status}
                           </span>
                           {check.error && <span className="block text-destructive/80 mt-0.5 break-all">({check.error})</span>}
                           {check.duration !== null && <span className="block text-muted-foreground mt-0.5">({check.duration}ms)</span>}
                        </div>
                        <span className="text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(check.timestamp), { addSuffix: true })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            ) : (
                 <p className="text-xs italic">No check history available yet.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
