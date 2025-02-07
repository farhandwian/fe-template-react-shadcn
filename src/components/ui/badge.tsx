import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary-brand-600 text-white hover:bg-secondary-brand-600/80",
        destructive:
          "border-transparent bg-[#DB3E52] text-white shadow hover:bg-[#DB3E52]/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-[#3FBC43] text-white shadow hover:bg-[#3FBC43]/80",
        warning:
          "border-transparent bg-orange-500 text-white shadow hover:bg-orange-500/80",
        info: "border-transparent bg-info text-white shadow hover:bg-info/80",
        muted: "border-transparent bg-gray-400 text-white shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
