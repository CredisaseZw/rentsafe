import CreditSummary from "./CreditSummary";
import OverviewCard from "./OverviewCard";

export default function OverviewTab() {
   return (
      <div>
         <h2 className="text-muted-foreground mb-4 px-3">Your Payment Status</h2>

         <div className="mb-10 flex items-center gap-5">
            <OverviewCard label="Risk Level" value="Low Risk" color="SUCCESS" />
            <OverviewCard label="Oldest Creditor" value="Jerad Spiwe" />
         </div>

         <h2 className="text-muted-foreground mb-4 px-3">Credit Summary</h2>

         <div className="grid grid-cols-2 gap-4">
            <CreditSummary
               title="Credit Given"
               amounts={{
                  current: 30,
                  due_1_30_days: 90,
                  due_31_60_days: 34,
                  due_61_90_days: 63,
                  due_90_days: 78,
               }}
            />
            <CreditSummary
               title="Credit Taken"
               amounts={{
                  current: 65,
                  due_1_30_days: 9,
                  due_31_60_days: 74,
                  due_61_90_days: 1,
                  due_90_days: 20000,
               }}
            />
         </div>
      </div>
   );
}
