import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "sm"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const base =
      "flex w-full rounded-md border border-color bg-white dark:bg-zinc-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    const variants = {
      default: "px-3 py-3 text-base md:text-sm",
      sm: "px-2 py-2 text-sm",
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
