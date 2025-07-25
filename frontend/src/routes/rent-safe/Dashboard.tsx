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
         <div className="flex w-full items-center justify-center">
            <TabsList className="border-foreground card mb-5 h-fit gap-3 p-1">
               {tabs.map((tab) => (
                  <TabsTrigger
                     key={tab.value}
                     value={tab.value}
                     className={`border-color cursor-pointer border px-4 py-2 text-gray-800 transition-none hover:bg-gray-100 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-md dark:text-white hover:dark:bg-zinc-900 data-[state=active]:dark:bg-zinc-900`}
                  >
                     <tab.icon />
                     {tab.label}
                  </TabsTrigger>
               ))}
            </TabsList>
         </div>
         <div className="main-sm-card">
            {tabs.map((tab) => (
               <TabsContent key={tab.value} value={tab.value}>
                  {tab.content}
               </TabsContent>
            ))}
         </div>
      </Tabs>
   );
}
