import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type Variant = "blue" | "success" | "warning" | "danger" | "pink"

export interface DashboardCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  variant?: Variant
  size?: "default" | "sm"
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  variant = "blue",
  size = "default"
}: DashboardCardProps) {

  const variants: Record<Variant, { icon: string; bg: string }> = {
    blue: {
      icon: "text-blue-700",
      bg: "bg-blue-100",
    },
    success: {
      icon: "text-emerald-700",
      bg: "bg-emerald-100",
    },
    warning: {
      icon: "text-amber-700",
      bg: "bg-amber-100",
    },
    danger: {
      icon: "text-red-700",
      bg: "bg-red-100",
    },
    pink: {
      icon: "text-pink-700",
      bg: "bg-pink-100",
    },
  }

  return (
    <div className="bg-white border border-color shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={cn(
          "font-bold mt-2 text-gray-900",
          size === "default" ? "text-3xl" : "text-xl"
          )}>
          {value}
        </p>
      </div>

      <div className={cn("p-3 rounded-xl", variants[variant].bg)}>
        <Icon className={cn("w-6 h-6", variants[variant].icon)} />
      </div>
    </div>
  )
}
