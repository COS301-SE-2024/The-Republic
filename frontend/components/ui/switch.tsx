"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: "bg-slate-200 dark:bg-slate-700",
        checked: "bg-slate-900 dark:bg-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "translate-x-0",
        checked: "translate-x-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof switchVariants> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled = false, className, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        type="button"
        ref={ref}
        onClick={handleClick}
        className={cn(
          switchVariants({ variant: checked ? "checked" : "default" }),
          className
        )}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        {...props}
      >
        <span
          className={cn(thumbVariants({ variant: checked ? "checked" : "default" }))}
        >
          <span className="sr-only">{checked ? "Enabled" : "Disabled"}</span>
        </span>
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };