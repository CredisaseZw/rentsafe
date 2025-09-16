import type { LucideIcon } from "lucide-react"

interface PropertyDetailProps {
    value?: string,
    Icon: LucideIcon
}   

function PropertyDetail({value, Icon}:PropertyDetailProps) {

  return (
    <div className="flex flex-row gap-3 mt-4">
        <Icon size={20} className="self-center text-gray-600 dark:text-white"/>
        <h6 className="text-sm text-gray-500 dark:text-white ">{value}</h6>
    </div>
  )
}

export default PropertyDetail