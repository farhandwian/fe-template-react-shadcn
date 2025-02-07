import * as React from "react"
 
import { cn } from "@/lib/utils"
 
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
 
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500 disabled:bg-gray-50 disabled:border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"
 
export { Textarea }