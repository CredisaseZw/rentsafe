import { useRef } from "react";
import Button from "./Button";
import PropertStatement from "./PropertStatement";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

function PropertyStatementContainer() {
   const componentRefence = useRef<HTMLDivElement>(null);

   const onDownloadPDF = useReactToPrint({
      contentRef: componentRefence,
      documentTitle: `NAME_-_${new Date().toISOString()}`,
      pageStyle: `
            @page {
             margin: 0.3in;
            }
             
            body {
                margin: 0;
                padding: 0;
            }
        `,
   });

   return (
      <div>
         <div ref={componentRefence}>
            <div className="">
               <div className="mt-10">
                  <table>
                     <tbody className="space-y-4">
                        <tr className="table-row">
                           <td className="pr-4 text-sm font-bold">Landlord:</td>
                           <td className="pl-4 text-sm font-bold">Lewnor (PVT) LTD</td>
                        </tr>
                        <tr className="table-row">
                           <td className="pr-4 text-sm font-bold">Period:</td>
                           <td className="pl-4 text-sm font-bold">1Jul25 - 11Jul25</td>
                        </tr>
                        <tr className="table-row">
                           <td className="pr-4 text-sm font-bold">Currency</td>
                           <td className="pl-4 text-sm font-bold text-red-600">US$</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <PropertStatement />
               <PropertStatement />
               <PropertStatement />
            </div>
         </div>
         <div className="mt-10 mb-10 flex justify-end">
            <Button variant="success" className="flex flex-row gap-3" onClick={onDownloadPDF}>
               <Printer size={18} className="self-center" />
               Print
            </Button>
         </div>
      </div>
   );
}

export default PropertyStatementContainer;
