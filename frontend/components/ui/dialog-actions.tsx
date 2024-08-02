"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DialogActions = React.forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end p-4 border-t border-gray-200", className)}
    {...props}
  />
));

DialogActions.displayName = "DialogActions";

export { DialogActions };
