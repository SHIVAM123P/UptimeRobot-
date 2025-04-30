import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-current", // Use current text color for border
        // Adjusted status colors for better visibility in dark mode
        green:
          "border-transparent bg-green-700/20 text-green-400 hover:bg-green-700/30", // Darker green bg, lighter text
        yellow:
           "border-transparent bg-yellow-700/20 text-yellow-400 hover:bg-yellow-700/30", // Darker yellow bg, lighter text
        red:
           "border-transparent bg-red-700/20 text-red-400 hover:bg-red-700/30", // Darker red bg, lighter text
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
