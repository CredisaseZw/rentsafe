import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
   children: React.ReactNode;
   variant?: "primary" | "success"; // add more variants as needed
   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
   className?: string;
   disabled?: false | true;
   type?: "button" | "submit" | "reset";
}

const variants: Record<"primary" | "success", string> = {
   primary: "bg-gray-800 hover:bg-gray-600 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black",
   success: "bg-green-600 hover:bg-green-800",
};

function Button({ children, variant = "primary", onClick, disabled, className, type = "button" }: ButtonProps) {
   return (
      <button
         type={type}
         disabled={disabled}
         onClick={onClick}
         className={cn(`${variants[variant]} rounded px-4 py-2 font-bold text-white`, className)}
      >
         {children}
      </button>
   );
}

export default Button;
