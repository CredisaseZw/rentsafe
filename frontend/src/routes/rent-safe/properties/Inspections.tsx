import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import Header from "@/components/general/Header";
import GlobalSummaryCard from "@/components/general/globalSummaryCard";
import Combined from "@/components/routes/rent-safe/inspections/combined";
import Industrial from "@/components/routes/rent-safe/inspections/industrial";
import Office from "@/components/routes/rent-safe/inspections/office";
import Other from "@/components/routes/rent-safe/inspections/other";
import Residental from "@/components/routes/rent-safe/inspections/residential";
import { Box, BoxIcon, Combine, FactoryIcon, House, HouseIcon, LaptopMinimalCheck, Menu } from "lucide-react";
import Retail from "@/components/routes/rent-safe/inspections/retail";

function Inspections() {
   const tabs = [
      {
         icon: Combine,
         value: "combined",
         label: "Combined",
         content: <Combined />,
      },
      {
         icon: House,
         value: "residental",
         label: "Residental",
         content: <Residental />,
      },
     
        {
         icon: LaptopMinimalCheck,
         value: "office",
         label: "Office",
         content: <Office />,
      },
        {
         icon: FactoryIcon,
         value: "industrial",
         label: "Instustrial",
         content: <Industrial />,
      },
         {
         icon: Box,
         value: "retail",
         label: "Retail",
         content: <Retail/>,
      },
      {
         icon: Menu,
         value: "other",
         label: "Other",
         content: <Other />,
      },
   ];
   return <div>
         <Header title="Property Insecptions" />
         <ColumnsContainer numberOfCols={6}>
            <GlobalSummaryCard
               value={"15"}
               subTitle="Combined"
               layoutScheme={{
                  icon: Combine,
                  color: "red",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Residental"
               layoutScheme={{
                  icon: HouseIcon,
                  color: "blue",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Office"
               layoutScheme={{
                  icon: LaptopMinimalCheck,
                  color: "amber",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Retail"
               layoutScheme={{
                  icon: BoxIcon,
                  color: "purple",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Industrial"
               layoutScheme={{
                  icon: FactoryIcon,
                  color: "green",
               }}
            /> 
             <GlobalSummaryCard
               value={"10"}
               subTitle="Other"
               layoutScheme={{
                  icon: Menu,
                  color: "green",
               }}
            />
         </ColumnsContainer>
         <div className="mt-8">
            <Tabs defaultValue={tabs[0].value}>
               <TabsList className="border-color dim-card mx-auto h-fit gap-3 rounded-md border px-3 shadow-md">
                  {tabs.map((tab) => (
                     <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`border-color cursor-pointer border px-4 py-2 text-gray-800 transition-none hover:bg-gray-100 data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:text-white hover:dark:bg-zinc-900 data-[state=active]:dark:bg-zinc-900`}
                     >
                        <tab.icon />
                        {tab.label}
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
         </div>
   </div>;
}

export default Inspections;
