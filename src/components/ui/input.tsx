import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  wrapperClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, type, icon, disabled, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", wrapperClassName)}>
        {icon && <span className="absolute left-3">{icon}</span>}
        <input
          type={type}
          className={cn(
            "flex w-full px-4 py-4 h-12 border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10" : "",
            disabled ? "border-gray-300 bg-gray-50 text-gray-500" : "",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
