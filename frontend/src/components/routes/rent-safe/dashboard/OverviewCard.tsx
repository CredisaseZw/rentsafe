import BaseCard from "@/components/general/BaseCard";

type OverviewCardProps = {
   label: string;
   value: string;
   color?: "PRIMARY" | "DANGER" | "SUCCESS";
};

export default function OverviewCard({ color, label, value }: OverviewCardProps) {
   return (
      <BaseCard className="flex overflow-hidden p-0 text-sm">
         <div className="grow p-2"> {label}</div>
         <div className={`grow p-2 ${color ? "bg-" + color : "bg-foreground/50"} text-white`}>{value}</div>
      </BaseCard>
   );
}
