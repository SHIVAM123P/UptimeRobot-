import * as React from "react";
import { Trash2 } from "lucide-react";
import { type Website } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface WebsiteListItemProps {
  website: Website;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function WebsiteListItem({ website, onDelete, isDeleting }: WebsiteListItemProps) {
  const handleDeleteClick = () => {
    onDelete(website.id);
  };

  return (
    <Card className="mb-4 transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <WebsiteStatusIndicator
             status={website.status}
             lastCheck={website.lastCheck}
             statusCode={website.statusCode}
             error={website.error}
          />
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline break-all"
          >
            {website.url}
          </a>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Delete website" disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the monitor for <span className="font-medium">{website.url}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={isDeleting ? "bg-destructive/80" : "bg-destructive hover:bg-destructive/90"}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
