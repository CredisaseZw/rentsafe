import SectionHeading from "@/components/general/SectionHeading";
import CreditSummary from "./CreditSummary";
import OverviewCard from "./OverviewCard";

export default function OverviewTab() {
   return (
      <div>
         <SectionHeading>Your Payment Status</SectionHeading>

         <div className="mb-5 flex items-center gap-5">
            <OverviewCard label="Risk Level" value="Low Risk" valueClassName="bg-SUCCESS text-white" />
            <OverviewCard label="Oldest Creditor" value="Jerad Spiwe" valueClassName="bg-foreground/60 text-white" />
         </div>

         <SectionHeading>Credit Summary</SectionHeading>

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
