import { cn } from "@/lib/utils"
import type React from "react"

interface props{
    legendTitle : string,
    children : React.ReactNode,
    className? : string
}

function Fieldset({legendTitle, children, className}: props) {
  return (
    <fieldset className={cn("border-color relative w-full mb-5 rounded-xl border bg-white/50 p-5 dark:bg-transparent", className)} >
        <legend className="px-4 font-semibold text-zinc-800 dark:text-gray-50"> {legendTitle}  </legend>
        {children}
    </fieldset>
  )
}

export default Fieldset