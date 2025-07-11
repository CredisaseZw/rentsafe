type OverviewCardProps = {
   label: string;
   value: string;
   color?: "PRIMARY" | "DANGER" | "SUCCESS";
};

export default function OverviewCard({ color, label, value }: OverviewCardProps) {
   return (
      <div className="border-foreground/10 flex overflow-hidden rounded-xl border bg-white shadow-sm">
         <div className="grow p-3"> {label}</div>
         <div className={`grow p-3 ${color ? "bg-" + color : "bg-foreground/50"} text-white`}>{value}</div>
      </div>
   );
}
