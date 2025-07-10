import React from 'react'
import { cn } from '@/lib/utils'

interface PillProps{
    children: React.ReactNode,
    variant : string,
    className?: string
}

let variants: Record<string , string> = {
    "success" : "bg-green-100 text-green-800",
    "primary" : "bg-blue-100 text-blue-800",
    "danger" : "bg-red-100 text-red-800",
    "warning" : "bg-amber-100 text-amber-800"
}

Pill.defaultProps = {
    varient : "primary"
}
function Pill({variant, children, className}: PillProps) {
  return (
    <div className={cn('inline-block rounded-full text-sm px-3 py-1 font-medium', variants[variant],className)}>
        {children}
    </div>
  )
}

export default Pill