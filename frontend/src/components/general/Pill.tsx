import React from "react";
import { cn } from "@/lib/utils";

interface PillProps {
   children: React.ReactNode;
   variant: string;
   className?: string;
}

const variants: Record<string, string> = {
   success: "bg-green-100 text-green-900 dark:text-green-500 dark:bg-green-800/10",
   primary: "bg-blue-100 text-blue-900 dark:text-blue-500 dark:bg-blue-800/10",
   danger: "bg-red-100 text-red-900 dark:text-red-500 dark:bg-red-800/10",
   warning: "bg-amber-100 text-amber-900 dark:text-amber-500 dark:bg-amber-800/10",
};

Pill.defaultProps = {
   variant: "primary",
};
function Pill({ variant, children, className }: PillProps) {
   return (
      <div className={cn("inline-block rounded-full px-3 py-1 text-sm font-medium", variants[variant], className)}>
         {children}
      </div>
   );
}

export default Pill;
