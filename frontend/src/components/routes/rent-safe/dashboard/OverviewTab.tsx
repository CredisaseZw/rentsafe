import CreditSummaryGraph from "./CreditSummaryGraph";

export default function OverviewTab() {
   return (
      <div className="grid grid-cols-2 gap-4">
         <CreditSummaryGraph title="Credit Given" />
         <CreditSummaryGraph title="Credit Taken" />
      </div>
   );
}
