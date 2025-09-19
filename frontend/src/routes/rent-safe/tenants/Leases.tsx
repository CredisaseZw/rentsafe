import Header from "@/components/general/Header";
import { Tabs, TabsTrigger, TabsList, TabsContent} from "@/components/ui/tabs";
import { CheckCheck, CirclePlus, CircleX } from "lucide-react";
import Active from "@/components/routes/rent-safe/tenant-leases/Active"
import ForRenewal from "@/components/routes/rent-safe/tenant-leases/ForRenewal";
import Terminated from "@/components/routes/rent-safe/tenant-leases/Terminated";
import { SubscriptionSheet } from "@/components/general/SubscriptionsManagementSheet";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

function Leases() {
   const { open, isMobile, openMobile } = useSidebar();
   const isSidebarOpen = isMobile ? openMobile : open;
   const tabs = [
      {
         icon: CheckCheck,
         value: "active",
         label: "Active",
      content: <Active />,
      },
      {
         icon: CirclePlus,
         value: "for_renewal",
         label: "For Renewal",
         content: <ForRenewal />,
      },   
      {
         icon: CircleX,
         value: "terminated",
         label: "Terminated",
         content: <Terminated />,
      },
   ]
return (
   <div className="relative">
      <Header title="Leases Management"/>
      <div className="mt-8">
         <Tabs defaultValue={tabs[0].value}>
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

            <div className="main-sm-card w-full sm:p-4 md:p-6 shadow-md">
               {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="text-sm sm:text-base">
                     {tab.content}
                  </TabsContent>
               ))}
            </div>

         </Tabs>
      </div>
  <div
  className={cn(
    "fixed bottom-0 sm:bottom-[20px] md:bottom-[0px] xl:bottom-0 2xl:bottom-0 p-2 bg-amber-400 z-50 flex items-center justify-center transition-all duration-300",
    isSidebarOpen ? "left-[300px] md:w-[calc(100vw-300px)]" : "left-0 w-full"
  )}
>
  <SubscriptionSheet />
</div>


   </div>)
}

export default Leases;
