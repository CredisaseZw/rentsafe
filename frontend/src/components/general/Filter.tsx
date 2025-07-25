import { ListFilter } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface FilterOption {
   label: string;
   value: string;
}

interface FilterProps {
   filterOptions: FilterOption[];
   onFilter: (value: string) => void;
   activeFilter: string;
}

export function Filter({ filterOptions, onFilter, activeFilter }: FilterProps) {
   const currentLabel = filterOptions.find((opt) => opt.value === activeFilter)?.label || "All Properties";

   return (
      <HoverCard openDelay={0} closeDelay={100}>
         <HoverCardTrigger className="items-center" asChild>
            <div className="flex items-center gap-2">
               <ListFilter className="h-4 w-4 text-gray-900 dark:text-gray-100" size={25} />
               <span className="text-md text-gray-900 dark:text-gray-100">{currentLabel}</span>
            </div>
         </HoverCardTrigger>
         <HoverCardContent className="flex w-64 flex-col gap-2 border border-gray-300 bg-white p-2 text-gray-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100">
            {filterOptions.map((option, index) => (
               <Button
                  key={index}
                  variant={option.value === activeFilter ? "default" : "ghost"}
                  onClick={() => onFilter(option.value)}
                  className="w-full justify-start"
               >
                  {option.label}
               </Button>
            ))}
         </HoverCardContent>
      </HoverCard>
   );
}
