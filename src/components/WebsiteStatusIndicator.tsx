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
// Removed date-fns import as it's no longer used here
// import { formatDistanceToNow } from 'date-fns';

interface WebsiteStatusIndicatorProps {
  status: Website["status"];
  // Removed props that are now displayed in WebsiteListItem
  // lastCheck?: Website["lastCheck"];
  // statusCode?: Website["statusCode"];
  // error?: Website["error"];
}

export function WebsiteStatusIndicator({
  status,
  // lastCheck, // Removed
  // statusCode, // Removed
  // error // Removed
}: WebsiteStatusIndicatorProps) {
  let IconComponent;
  let iconColorClass = "";
  let statusText = "Unknown";
  let tooltipContent = "Status is currently unknown.";

  // Removed timeAgo calculation as it's done in WebsiteListItem now
  // const timeAgo = lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true }) : 'never';

  switch (status) {
    case 'up':
      IconComponent = CheckCircle;
      iconColorClass = "text-green-500"; // Using specific color for clear indication
      statusText = "Up";
      tooltipContent = `Website is Up`; // Simplified tooltip
      break;
    case 'down':
      IconComponent = XCircle;
      iconColorClass = "text-red-500"; // Using specific color for clear indication
      statusText = "Down";
      tooltipContent = `Website is Down`; // Simplified tooltip
      // Removed status code and error from tooltip
      break;
    case 'checking':
      IconComponent = Loader2;
      iconColorClass = "text-muted-foreground animate-spin";
      statusText = "Checking";
      tooltipContent = `Checking status...`; // Simplified tooltip
      break;
    case 'error':
       IconComponent = AlertCircle;
       iconColorClass = "text-yellow-500"; // Using specific color for clear indication
       statusText = "Error";
       tooltipContent = `Error during check`; // Simplified tooltip
       // Removed error details from tooltip
       break;
    default:
      IconComponent = AlertCircle;
      iconColorClass = "text-muted-foreground";
      statusText = "Unknown";
      tooltipContent = `Status unknown`; // Simplified tooltip
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Added cursor-help for better UX */}
          <div className="flex items-center gap-2 cursor-help">
            <IconComponent className={cn("h-5 w-5 flex-shrink-0", iconColorClass)} aria-label={statusText} />
            {/* Screen reader text remains useful */}
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
