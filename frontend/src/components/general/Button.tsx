import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
   asChild?: false | true;
   children: React.ReactNode;
   variant?: "primary" | "success" | "danger"; // add more variants as needed
   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
   className?: string;
   disabled?: boolean;
   size?: "sm" | "md" | "lg";
   type?: "button" | "submit" | "reset";
}

const variants: Record<"primary" | "success" | "danger", string> = {
   primary: "bg-gray-800 hover:bg-gray-600 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black",
   success: "bg-green-600 hover:bg-green-800",
   danger: "bg-red-600 hover:bg-red-700",
};

const sizes: Record<"sm" | "md" | "lg", string> = {
   sm: "px-3 py-1 text-xs",
   md: "px-4 py-2 text-sm",
   lg: "px-6 py-3 text-base",
};

function Button({
   children,
   asChild,
   variant = "primary",
   size = "md", // default size
   onClick,
   disabled,
   className,
   type = "button",
}: ButtonProps) {
   return (
      <button
         type={type}
         disabled={disabled}
         onClick={onClick}
         className={cn(
            `${variants[variant]} ${sizes[size]} rounded text-white`,
            asChild ? "flex flex-row items-center justify-center gap-3" : "",
            className,
         )}
      >
         {children}
      </button>
   );
}

export default Button;
