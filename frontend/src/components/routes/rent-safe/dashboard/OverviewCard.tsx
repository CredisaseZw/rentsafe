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
         <div className="grow p-2"> {label}</div>
         <div className={cn("grow p-2", valueClassName)}>{value}</div>
      </BaseCard>
   );
}
