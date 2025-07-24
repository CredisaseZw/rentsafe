import CompanyPaymentStatusTab from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusTab";
import OverviewTab from "@/components/routes/rent-safe/dashboard/OverviewTab";
import IndividualPaymentStatusTab from "@/components/routes/rent-safe/dashboard/IndividualPaymentStatusTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, ChartLine, User } from "lucide-react";

export default function Dashboard() {
   const tabs = [
      { icon: ChartLine, value: "overview", label: "Overview", content: <OverviewTab /> },
      {
         icon: User,
         value: "individual-payment-status",
         label: "Individual Payment Status",
         content: <IndividualPaymentStatusTab />,
      },
      {
         icon: Building2,
         value: "company-payment-status",
         label: "Company Payment Status",
         content: <CompanyPaymentStatusTab />,
      },
   ];

   return (
      <Tabs defaultValue={tabs[0].value}>
         <TabsList className="border-foreground bg-PRIMARY mb-5 h-fit p-1">
            {tabs.map((tab) => (
               <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:text-foreground cursor-pointer border-0 text-white transition-none hover:bg-black/40"
               >
                  <tab.icon />
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
