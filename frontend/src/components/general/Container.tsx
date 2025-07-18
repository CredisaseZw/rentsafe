import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = {
   children: React.ReactNode;
   className?: string;
   small?: boolean;
};

export default function Container({ children, small, className }: ContainerProps) {
   return <div className={cn("mx-auto p-2", small ? "max-w-7xl" : "max-w-[1440px]", className)}>{children}</div>;
}
