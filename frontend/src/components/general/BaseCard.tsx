import { cn } from "@/lib/utils";
import React from "react";

export default function BaseCard({ className, children }: { className?: string; children: React.ReactNode }) {
   return (
      <div className={cn("border-color rounded-lg border bg-white p-3.5 shadow-sm dark:bg-zinc-900", className)}>
         {children}
      </div>
   );
}
