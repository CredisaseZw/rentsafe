import { MapPin, Phone, Smartphone, Mail } from "lucide-react";

function ContractManagementTR() {
   return (
      <tr className="td-border-color w-full border-t border-b text-sm">
         <td className="td-border-color border-r px-5 py-3 text-center">1</td>
         <td className="td-border-color border-r">
            <table className="w-full">
               <tbody>
                  <tr className="td-border-color border-b">
                     <td colSpan={2} className="px-5 py-3 text-center">
                        <div className="flex w-full flex-col items-center">
                           <h6 className="text-PRIMARY text-lg font-bold">Cool Air</h6>
                           <p className="flex items-center gap-1">
                              <MapPin size={15} />2 Hala, Graniteside Harare, Zimbabwe
                           </p>
                           <div className="mt-3 flex flex-row gap-5">
                              <p className="flex items-center gap-1">
                                 <Phone size={15} />
                                 0242704856
                              </p>
                              <p className="flex items-center gap-1">
                                 <Smartphone size={15} />
                                 07188522555
                              </p>
                              <p className="flex items-center gap-1">
                                 <Mail size={15} />
                                 ksink@gmsil.com
                              </p>
                           </div>
                        </div>
                     </td>
                  </tr>
                  <tr>
                     <td className="td-border-color w-1/2 border-r px-5 py-3 align-top">
                        <div className="flex flex-col gap-1">
                           <span className="text-PRIMARY font-bold">Contact Person</span>
                           <div className="flex flex-col gap-1">
                              <span className="font-bold">Kai Cent</span>
                              <p className="flex items-center gap-1">
                                 <Smartphone size={15} />
                                 07188522555
                              </p>
                              <p className="flex items-center gap-1">
                                 <Mail size={15} />
                                 ksink@gmsil.com
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="w-1/2 px-5 py-3 align-top">
                        <div className="flex flex-col gap-1">
                           <span className="text-PRIMARY font-bold">Company Information</span>
                           <div className="flex flex-row gap-2">
                              <p className="flex items-center font-bold">Industry:</p>
                              <p className="flex items-center gap-1">HVAC</p>
                           </div>
                           <div className="flex flex-row gap-2">
                              <p className="flex items-center font-bold">License:</p>
                              <p className="flex items-center">CM-4685-4555</p>
                           </div>
                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td>
            <select name="" id="">
               <option value="active" selected>
                  Active
               </option>
               <option value="deactive" selected>
                  Deactive
               </option>
            </select>
         </td>
      </tr>
   );
}

export default ContractManagementTR;
