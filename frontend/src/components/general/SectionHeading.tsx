import { cn } from "@/lib/utils";
import React from "react";

export default function SectionHeading({ className, children }: { className?: string; children: React.ReactNode }) {
   return <h2 className={cn("mb-4 font-bold text-gray-800 dark:text-gray-100", className)}>{children}</h2>;
}
