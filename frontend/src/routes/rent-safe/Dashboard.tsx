import CompanyPaymentStatusTab from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusTab";
import OverviewTab from "@/components/routes/rent-safe/dashboard/OverviewTab";
import IndividualPaymentStatusTab from "@/components/routes/rent-safe/dashboard/IndividualPaymentStatusTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
   const tabs = [
      { value: "overview", label: "Overview", content: <OverviewTab /> },
      {
         value: "individual-payment-status",
         label: "Individual Payment Status",
         content: <IndividualPaymentStatusTab />,
      },
      { value: "company-payment-status", label: "Company Payment Status", content: <CompanyPaymentStatusTab /> },
   ];

   return (
      <Tabs defaultValue={tabs[0].value} className="w-[400px]">
         <TabsList>
            {tabs.map((tab) => (
               <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
               </TabsTrigger>
            ))}
         </TabsList>

         {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
               {tab.content}
            </TabsContent>
         ))}
      </Tabs>
   );
}
