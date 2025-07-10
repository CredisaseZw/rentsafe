import CreditSummary from "./CreditSummary";

export default function OverviewTab() {
   return (
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
   );
}
