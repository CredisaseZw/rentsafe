import CompanyPaymentStatusTab from "@/components/routes/rent-safe/dashboard/CompanyPaymentStatusTab";
import OverviewTab from "@/components/routes/rent-safe/dashboard/OverviewTab";
import IndividualPaymentStatusTab from "@/components/routes/rent-safe/dashboard/IndividualPaymentStatusTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, ChartLine, User } from "lucide-react";
import { useSearchParams } from "react-router";

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
   const [params] = useSearchParams();
   const currentTab = params.get("addIndividual") ? tabs[1].value :
   params.get("addCompany") ? tabs[2].value :tabs[0].value

   return (
      <Tabs defaultValue={currentTab}>
        <TabsList className="border-color dim-card mx-auto h-fit gap-3 rounded-md border px-3 shadow-md flex flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
               <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 border-color cursor-pointer border px-4 py-2 text-sm text-gray-800 transition-none hover:bg-gray-100 data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:text-white hover:dark:bg-zinc-900 data-[state=active]:dark:bg-zinc-900 whitespace-nowrap"
               >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
               </TabsTrigger>
            ))}
         </TabsList>


         <div className="main-sm-card rounded-md p-4 shadow-md">
            {tabs.map((tab) => (
               <TabsContent key={tab.value} value={tab.value}>
                  {tab.content}
               </TabsContent>
            ))}
         </div>
      </Tabs>
   );
}
