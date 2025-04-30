import * as React from "react";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { type Website } from "@/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from 'date-fns';

interface WebsiteStatusIndicatorProps {
  status: Website["status"];
  lastCheck?: Website["lastCheck"];
  statusCode?: Website["statusCode"];
  error?: Website["error"];
}

export function WebsiteStatusIndicator({
  status,
  lastCheck,
  statusCode,
  error
}: WebsiteStatusIndicatorProps) {
  let IconComponent;
  let iconColorClass = "";
  let statusText = "Unknown";
  let tooltipContent = "Status is currently unknown.";

  const timeAgo = lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true }) : 'never';

  switch (status) {
    case 'up':
      IconComponent = CheckCircle;
      iconColorClass = "text-green-500"; // Use Tailwind color directly for simplicity here
      statusText = "Up";
      tooltipContent = `Website is up (Status ${statusCode || 'N/A'}). Last checked ${timeAgo}.`;
      break;
    case 'down':
      IconComponent = XCircle;
      iconColorClass = "text-red-500"; // Use Tailwind color directly for simplicity here
      statusText = "Down";
      tooltipContent = `Website is down (Status ${statusCode || 'N/A'}). Last checked ${timeAgo}.`;
      if (error) {
        tooltipContent += ` Error: ${error}`;
      }
      break;
    case 'checking':
      IconComponent = Loader2;
      iconColorClass = "text-muted-foreground animate-spin";
      statusText = "Checking";
      tooltipContent = `Checking website status...`;
      break;
    case 'error':
       IconComponent = AlertCircle;
       iconColorClass = "text-yellow-500"; // Use Tailwind color directly for simplicity here
       statusText = "Error";
       tooltipContent = `Error checking status. Last attempt ${timeAgo}. Error: ${error || 'Unknown error'}`;
       break;
    default:
      IconComponent = AlertCircle;
      iconColorClass = "text-muted-foreground";
      statusText = "Unknown";
      tooltipContent = `Status unknown. Last checked ${timeAgo}.`;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <IconComponent className={cn("h-5 w-5", iconColorClass)} aria-label={statusText} />
            <span className="sr-only">{statusText}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
