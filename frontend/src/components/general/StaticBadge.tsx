import type React from "react"

interface props{
    children : React.ReactNode,
    bgColor :  string
}
function StaticBadge({bgColor, children}:props) {
  return (
    <div className={`p-1 rounded text-white flex items-center justify-center ${bgColor}`}>{children}</div>
  )
}

export default StaticBadge