import type { LucideIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils' // optional, if using className merging

interface GSCProps {
  value: string | React.ReactElement
  subTitle: string
  layoutScheme: {
    icon: LucideIcon
    color:  string 
}
  valueAsChild?: React.ReactNode | false
}

function GlobalSummaryCard({
  value,
  subTitle,
  layoutScheme,
  valueAsChild = false
}: GSCProps) {
  let Icon = layoutScheme.icon

  return (
    <div className="bg-white px-5 py-8 shadow rounded-xl">
      <div className="flex flex-row">
        <div className={`self-center p-4 rounded-full mr-5 bg-${layoutScheme.color}-200`}>
          <Icon className={`text-${layoutScheme.color}-800`} />
        </div>
        <div className="flex flex-col">
          {valueAsChild ? (
            <>{value}</>
          ) : (
            <h1 className="font-semibold text-4xl text-gray-700">{value}</h1>
          )}
          <span className="mt-2 text-sm uppercase">{subTitle}</span>
        </div>
      </div>
    </div>
  )
}

export default GlobalSummaryCard
