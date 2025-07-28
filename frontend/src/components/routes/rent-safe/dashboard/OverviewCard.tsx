import BaseCard from "@/components/general/BaseCard";
import { cn } from "@/lib/utils";

type OverviewCardProps = {
   label: string;
   value: string;
   valueClassName?: string;
};

export default function OverviewCard({ label, value, valueClassName }: OverviewCardProps) {
   return (
      <BaseCard className="flex overflow-hidden p-0 text-sm">
         <div className="grow p-3 text-gray-800 dark:bg-zinc-900 dark:text-gray-100"> {label}</div>
         <div className={cn("grow p-3", valueClassName)}>{value}</div>
      </BaseCard>
   );
}
