import type { LucideIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "../ui/label"

interface props {
    label : string,
    subLabel? : string
    Icon: LucideIcon,
    check? : boolean
    name?: string
    onCheck: (val: boolean)=> void
}

function SwitchContainer({label, name, subLabel, Icon, check = true, onCheck}:props) {
  return (
    <div className="rounded-md border border-color bg-gray-50 dark:bg-zinc-900 py-4 px-5">
        <div className="w-full flex flex-row justify-between">
            <div className="w-fit flex flex-row gap-3 items-center">
                <div className="bg-green-600/20 p-2 h-fit rounded-xl">
                    <Icon className="w-4 h-4 text-green-600"/>
                </div>
                <div className="flex flex-col gap-1 self-center">
                    <Label htmlFor={`switch__${label}`} className="font-semibold cursor-pointer text-gray-800 dark:text-white">{label}</Label>
                    <span className="text-xs text-gray-700 dark:text-white">{subLabel}</span>
                </div>
            </div>
            <Switch
                id={`switch__${label}`}
                name={name ?? ""}
                checked={check}
                onCheckedChange={(e)=> onCheck(e)}
                className="self-center"
            />
        </div>  
    </div>
)
}

export default SwitchContainer