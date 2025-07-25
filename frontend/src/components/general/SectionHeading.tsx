import { cn } from "@/lib/utils";
import React from "react";

export default function SectionHeading({ className, children }: { className?: string; children: React.ReactNode }) {
   return <h2 className={cn("text-muted-foreground mb-4 px-3", className)}>{children}</h2>;
}
