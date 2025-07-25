import type { LucideIcon } from "lucide-react";
import React from "react";

interface GSCProps {
   value: string | React.ReactElement;
   subTitle: string;
   layoutScheme: {
      icon: LucideIcon;
      color: string;
   };
   valueAsChild?: React.ReactNode | false;
}

function GlobalSummaryCard({ value, subTitle, layoutScheme, valueAsChild = false }: GSCProps) {
   const Icon = layoutScheme.icon;

   return (
      <div className="rounded-xl border border-gray-300 bg-white px-5 py-8 shadow dark:border-zinc-800 dark:bg-zinc-950">
         <div className="flex flex-row">
            <div className={`mr-5 self-center rounded-full p-4 bg-${layoutScheme.color}-200`}>
               <Icon className={`text-${layoutScheme.color}-800`} />
            </div>
            <div className="flex flex-col">
               {valueAsChild ? (
                  <>{value}</>
               ) : (
                  <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-100">{value}</h1>
               )}
               <span className="mt-2 text-sm uppercase">{subTitle}</span>
            </div>
         </div>
      </div>
   );
}

export default GlobalSummaryCard;
