function PropertStatement() {
   return (
      <>
         <div className="mt-10">
            <div className="flex flex-row">
               <span className="text-PRIMARY me-5 font-bold">Property: </span>
               <span className="text-PRIMARY me- font-bold"> Paddington Square</span>
            </div>
         </div>
         <div className="mt-2">
            <table className="w-full">
               <thead>
                  <tr className="">
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Lease ID
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Tenant
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Balance B/F
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Amount Charged (Exl VAT)
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        VAT
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Amount Charged (Inc VAT)
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Amount Paid
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        Adjustments
                     </th>
                     <th className="text-PRIMARY td-border-color border bg-blue-200 px-5 py-3 font-bold dark:bg-blue-800/10">
                        End Balance
                     </th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="px-5 py-3 text-center">45</td>
                     <td className="px-5 py-3 text-start">Ezel Pool</td>
                     <td className="px-5 py-3 text-start">2,683.00</td>
                     <td className="td-border-color border-l px-5 py-3 text-end">-</td>
                     <td className="td-border-color border-r px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-start">-</td>
                     <td className="px-5 py-3 text-start">(2,683.00)</td>
                     <td className="px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-end">-</td>
                  </tr>
                  <tr>
                     <td className="px-5 py-3 text-center">66</td>
                     <td className="px-5 py-3 text-start">Ezel Pool</td>
                     <td className="px-5 py-3 text-start">2,683.00</td>
                     <td className="td-border-color border-l px-5 py-3 text-end">-</td>
                     <td className="td-border-color border-r px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-start">-</td>
                     <td className="px-5 py-3 text-start">(2,683.00)</td>
                     <td className="px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-end">-</td>
                  </tr>
                  <tr>
                     <td className="px-5 py-3 text-center">45</td>
                     <td className="px-5 py-3 text-start">Tin Roof</td>
                     <td className="px-5 py-3 text-start">9,800.00</td>
                     <td className="td-border-color border-l px-5 py-3 text-end">-</td>
                     <td className="td-border-color border-r px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-start">-</td>
                     <td className="px-5 py-3 text-start">(2,683.00)</td>
                     <td className="px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-end font-bold">120.20</td>
                  </tr>
                  <tr className="totals-">
                     <td>{""}</td>
                     <td>{""}</td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 font-bold">12,482.00</td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-end font-bold">-</td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-end font-bold">-</td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-start font-bold">
                        -
                     </td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-start font-bold">
                        (11,845.00)
                     </td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-end font-bold">
                        (500.00)
                     </td>
                     <td className="border-t border-b-2 border-double border-black px-4 py-2 text-end font-bold">
                        (130.00)
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </>
   );
}

export default PropertStatement;
