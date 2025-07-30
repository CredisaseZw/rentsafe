import Button from "./Button";
import { Eye } from "lucide-react";
import Pill from "./Pill";

function PropertyListTableRow() {
   return (
      <tr className="hover:bg-gray-100/90 hover:dark:bg-zinc-800/10">
         <td className="border-color border px-4 py-2">1</td>
         <td className="border-color border">
            <table className="w-full table-auto">
               <tbody>
                  <tr>
                     <td
                        colSpan={4}
                        className="bg-blue-200 px-4 py-2 text-center font-semibold text-blue-900 dark:bg-blue-800/10 dark:text-blue-500"
                     >
                        8 Floor, West Wing, Club chamber, Cnr 3rd/N, Mandela Str, CBD, Harare, Zimbabwe
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={2} className="border-color border-t border-r px-4 py-2">
                        <Pill variant="success">Commercial Offices</Pill>
                     </td>
                     <td colSpan={2} className="border-color border-t border-l px-4 py-2">
                        <span>4-Offices</span>
                     </td>
                  </tr>
                  <tr className="border-color border-t border-b">
                     <td className="border-color border-r px-4 py-2 text-center font-medium">Status</td>
                     <td className="border-color border-r px-4 py-2 text-center font-medium">Tenant</td>
                     <td className="border-color border-r px-4 py-2 text-center font-medium">Monthly Rent</td>
                     <td className="px-4 py-2 text-center font-medium">Lease Expiry</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-2 text-center">Occupied</td>
                     <td className="px-4 py-2 text-center">Edward Attorneys</td>
                     <td className="px-4 py-2 text-center">US1,100</td>
                     <td className="px-4 py-2 text-center">31-DEC-25</td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td className="border-color border px-4 py-2">
            <Button asChild={true}>
               <Eye size={18} className="self-center" />
               <span className="self-center">View Lease</span>
            </Button>
         </td>
      </tr>
   );
}

export default PropertyListTableRow;
