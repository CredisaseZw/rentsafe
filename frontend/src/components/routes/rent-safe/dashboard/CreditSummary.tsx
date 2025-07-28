import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import BaseCard from "@/components/general/BaseCard";

type CreditSummaryProps = {
   title: string;
   amounts: {
      current: number;
      due_1_30_days: number;
      due_31_60_days: number;
      due_61_90_days: number;
      due_90_days: number;
   };
};

export default function CreditSummary({ title, amounts }: CreditSummaryProps) {
   const chartData = [
      { fill: "green", status: "Current", amount: amounts.current },
      { fill: "darkorange", status: "Due 1-30 days", amount: amounts.due_1_30_days },
      { fill: "tomato", status: "Due 31-60 days", amount: amounts.due_31_60_days },
      { fill: "firebrick", status: "Due 61-90 days", amount: amounts.due_61_90_days },
      { fill: "black", status: "Due 90+ days", amount: amounts.due_90_days },
   ];

   const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

   return (
      <BaseCard>
         <div className="mb-2 font-semibold underline underline-offset-4">{title}</div>
         <div className="flex flex-col items-start justify-start gap-2">
            {chartData.map((item) => (
               <div key={item.status} className="flex w-full items-center gap-4 text-sm">
                  <div style={{ color: item.fill }} className="rounded-sm font-bold">
                     {item.status}
                  </div>

                  <div className="bg-foreground/10 border-color h-0.5 grow border" />

                  <div className="flex gap-3 text-nowrap">
                     <div className="flex items-center gap-2">
                        <div>{formatCurrency(item.amount)}</div>
                        <div className="bg-foreground/10 h-0.5 w-3" />

                        <div>{((item.amount / totalAmount) * 100).toFixed(2)}%</div>
                     </div>
                     <Button asChild variant="outline" size="xs">
                        <Link to={`/services/rent-safe/leases?show=${item.status}`}>View</Link>
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      </BaseCard>
   );
}
