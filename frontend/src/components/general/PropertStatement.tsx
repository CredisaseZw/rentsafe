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
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">Lease ID</th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">Tenant</th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        Balance B/F
                     </th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        Amount Charged (Exl VAT)
                     </th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">VAT</th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        Amount Charged (Inc VAT)
                     </th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        Amount Paid
                     </th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        Adjustments
                     </th>
                     <th className="text-PRIMARY border border-gray-300 bg-blue-200 px-5 py-3 font-bold">
                        End Balance
                     </th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="px-5 py-3 text-center">45</td>
                     <td className="px-5 py-3 text-start">Ezel Pool</td>
                     <td className="px-5 py-3 text-start">2,683.00</td>
                     <td className="border-l border-gray-300 px-5 py-3 text-end">-</td>
                     <td className="border-r border-gray-300 px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-start">-</td>
                     <td className="px-5 py-3 text-start">(2,683.00)</td>
                     <td className="px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-end">-</td>
                  </tr>
                  <tr>
                     <td className="px-5 py-3 text-center">66</td>
                     <td className="px-5 py-3 text-start">Ezel Pool</td>
                     <td className="px-5 py-3 text-start">2,683.00</td>
                     <td className="border-l border-gray-300 px-5 py-3 text-end">-</td>
                     <td className="border-r border-gray-300 px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-start">-</td>
                     <td className="px-5 py-3 text-start">(2,683.00)</td>
                     <td className="px-5 py-3 text-end">-</td>
                     <td className="px-5 py-3 text-end">-</td>
                  </tr>
                  <tr>
                     <td className="px-5 py-3 text-center">45</td>
                     <td className="px-5 py-3 text-start">Tin Roof</td>
                     <td className="px-5 py-3 text-start">9,800.00</td>
                     <td className="border-l border-gray-300 px-5 py-3 text-end">-</td>
                     <td className="border-r border-gray-300 px-5 py-3 text-end">-</td>
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
