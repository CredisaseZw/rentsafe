import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Repeat, FileCheck, icons, FileChartLine, FileX } from "lucide-react";
import Invoices from "@/components/routes/rent-safe/accounting/sales/sales-invoice/Invoices";
import RecurringInvoices from "@/components/routes/rent-safe/accounting/sales/sales-invoice/RecurringInvoices";
import ProformaInvoices from "@/components/routes/rent-safe/accounting/sales/sales-invoice/ProformaInvoices";
import FiscalInvoices from "@/components/routes/rent-safe/accounting/sales/sales-invoice/FiscalInvoices";
import CancelledInvoices from "@/components/routes/rent-safe/accounting/sales/sales-invoice/CancelledInvoices";

export default function SalesInvoicing() {
   const tabs = [
      { icon: FileText,
        value: "invoices",
        label: "Invoices",
        content: <Invoices /> },
      {
         icon: Repeat,
         value: "recurring-invoices",
         label: "Recurring",
         content: <RecurringInvoices/>,
      },
      {
         icon: FileCheck,
         value: "proforma-invoices",
         label: "Proforma Invoices",
         content: <ProformaInvoices />,
      },
      {
         icon : FileChartLine,
         value : "fiscal-invoices",
         label : "Fiscal Invoices",
         content : <FiscalInvoices/>
      },
      {
         icon : FileX,
         value : "cancelled-invoices",
         label : "Cancelled Invoices",
         content : <CancelledInvoices/>
      }
   ];
   
   return (
      <Tabs defaultValue={"invoices"}>
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
