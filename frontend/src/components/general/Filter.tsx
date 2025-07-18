import { ListFilter } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import type React from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  filterOptions: FilterOption[];
  onFilter: (value: string) => void;
  activeFilter: string;
}

export function Filter({ filterOptions, onFilter, activeFilter,}: FilterProps) {
  const currentLabel = filterOptions.find((opt) => opt.value === activeFilter)?.label || "All Properties";

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger className="items-center" asChild>
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4" size={25} />
          <span className="text-md text-gray-700">{currentLabel}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 flex flex-col gap-2 p-2">
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
