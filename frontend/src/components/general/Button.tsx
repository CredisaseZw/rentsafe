import React, { type ReactElement } from 'react'
import { cn } from '@/lib/utils'
interface ButtonProps{
    children : React.ReactNode,
    variant : string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className? : string
}

let variants: Record<string, string> = {
    "primary": "bg-PRIMARY hover:bg-primary-dark"
}

Button.defaultProps = {
    variant: "primary"
}

function Button({ children, variant = "primary", onClick,className }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `${variants[variant]} text-white font-bold py-2 px-4 rounded`,
        className
      )}
    >
      {children}
    </button>
  )
}
export default Button
