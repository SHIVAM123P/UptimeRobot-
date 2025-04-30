import * as React from "react";
import { Trash2, ChevronDown, ChevronUp, History } from "lucide-react"; // Added History icon
import { formatDistanceToNow, format } from 'date-fns'; // Added format
import { type Website, type WebsiteCheck } from "@/types"; // Import WebsiteCheck
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
import { getStatusDescription } from "@/lib/http-status-codes"; // Import helper
import { ScrollArea } from "@/components/ui/scroll-area"; // For history list if it gets long

interface WebsiteListItemProps {
  website: Website;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function WebsiteListItem({ website, onDelete, isDeleting }: WebsiteListItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleDeleteClick = () => {
    onDelete(website.id);
  };

  const timeAgo = website.lastCheck ? formatDistanceToNow(new Date(website.lastCheck), { addSuffix: true }) : 'never';

  return (
    <Card className="mb-4 transition-shadow duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="flex flex-col p-0">
        <div className="flex items-center justify-between p-4">
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
            </div>
          </div>

          <div className="flex items-center gap-1 ml-4">
             {/* Expand/Collapse Button */}
             {(website.statusCode !== null || website.error || website.lastCheck || (website.history && website.history.length > 0)) && (
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setIsExpanded(!isExpanded)}
                 aria-label={isExpanded ? "Collapse details" : "Expand details"}
                 className="h-8 w-8"
               >
                 {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
               </Button>
              )}

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Delete website" disabled={isDeleting} className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the monitor for <span className="font-medium break-all">{website.url}</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className={cn(
                      buttonVariants({ variant: "destructive" }),
                      isDeleting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="bg-muted/50 px-4 py-3 border-t border-border text-sm text-muted-foreground space-y-3">
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
            {website.history && website.history.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <History className="h-4 w-4" /> Recent Checks
                </h4>
                <ScrollArea className="h-[150px] pr-3"> {/* Limit height and add scroll */}
                  <ul className="space-y-2">
                    {website.history.map((check, index) => (
                      <li key={index} className="flex justify-between items-start gap-2 text-xs border-b border-border/30 pb-1 last:border-b-0">
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
                        </div>
                        <span className="text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(check.timestamp), { addSuffix: true })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}

             {!website.history || website.history.length === 0 && (
                <p className="text-xs italic">No check history available yet.</p>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
