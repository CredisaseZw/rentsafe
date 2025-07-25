import React from "react";
import { BadgeCentIcon, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";

const ICON_DATA: Record<string, { icon: React.JSX.Element; bg: string; text: string }> = {
   "Total Properties": {
      icon: <HouseIcon className="text-blue-800" />,
      bg: "bg-blue-200",
      text: "text-blue-800",
   },
   Occupied: {
      icon: <Users className="text-indigo-800" />,
      bg: "bg-indigo-200",
      text: "text-indigo-800",
   },
   Vacant: {
      icon: <DoorOpen className="text-purple-800" />,
      bg: "bg-purple-200",
      text: "text-purple-800",
   },
   Maintenance: {
      icon: <Wrench className="text-amber-800" />,
      bg: "bg-amber-200",
      text: "text-amber-800",
   },
   "Monthly Revenue": {
      icon: <BadgeCentIcon className="text-green-800" />,
      bg: "bg-green-200",
      text: "text-green-800",
   },
};

export interface SummaryCardProps {
   subTitle: string;
   value: number | string;
}

function SummaryCard({ subTitle, value }: SummaryCardProps) {
   const iconData = ICON_DATA[subTitle] || ICON_DATA["Total Properties"];

   return (
      <div className="rounded-xl border border-gray-300 bg-white px-5 py-8 shadow dark:border-zinc-800 dark:bg-zinc-950">
         <div className="flex flex-row">
            <div className={`icon-container self-center ${iconData.bg} mr-5 rounded-full p-4`}>{iconData.icon}</div>
            <div className="flex flex-col">
               <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-100">{value}</h1>
               <span className="mt-2 text-sm uppercase">{subTitle}</span>
            </div>
         </div>
      </div>
   );
}

export default SummaryCard;
