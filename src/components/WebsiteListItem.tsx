import * as React from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { type Website } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
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
                title={website.url} // Add title for full URL on hover if truncated
              >
                {website.url}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-4">
             {/* Expand/Collapse Button */}
             {(website.statusCode || website.error || website.lastCheck) && (
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
                      buttonVariants({ variant: "destructive" }), // Use buttonVariants here
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
          <div className="bg-muted/50 px-4 py-3 border-t border-border text-sm text-muted-foreground space-y-1">
            {website.lastCheck && (
              <p><strong>Last check:</strong> {timeAgo} ({new Date(website.lastCheck).toLocaleString()})</p>
            )}
             {website.statusCode !== null && website.statusCode !== undefined && (
               <p><strong>Status Code:</strong>
                 <Badge
                    variant={website.status === 'up' ? 'green' : 'red'} // Use custom variants
                    className="ml-2" // Removed direct color classes
                  >
                  {website.statusCode}
                 </Badge>
               </p>
             )}
             {website.error && (website.status === 'down' || website.status === 'error') && (
               <p className="break-words"><strong>Error:</strong> {website.error}</p>
             )}
            {website.status === 'checking' && <p>Currently checking status...</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
