import React from 'react'

function PropertStatement() {
  return (
   <>
        <div className='mt-10'>
            <div className="flex flex-row">
              <span className='font-bold text-PRIMARY me-5'>Property: </span>
              <span className='font-bold text-PRIMARY me-'> Paddington Square</span>
            </div>
        </div>
        <div className='mt-2'>
          <table className='w-full'>
            <thead>
              <tr className=''>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Lease ID</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Tenant</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Balance B/F</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Amount Charged (Exl VAT)</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>VAT</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Amount Charged (Inc VAT)</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Amount Paid</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>Adjustments</th>
                <th className='border border-gray-300 px-5 py-3 font-bold bg-blue-200 text-PRIMARY'>End Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='text-center px-5 py-3'>45</td>
                <td className='text-start px-5 py-3'>Ezel Pool</td>
                <td className='text-start px-5 py-3'>2,683.00</td>
                <td className='text-end px-5 py-3 border-l  border-gray-300'>-</td>
                <td className='text-end px-5 py-3 border-r border-gray-300'>-</td>
                <td className='text-start px-5 py-3'>-</td>
                <td className='text-start px-5 py-3'>(2,683.00)</td>
                <td className='text-end px-5 py-3'>-</td>
                <td className='text-end px-5 py-3'>-</td>
              </tr>
               <tr>
                <td className='text-center px-5 py-3'>66</td>
                <td className='text-start px-5 py-3'>Ezel Pool</td>
                <td className='text-start px-5 py-3'>2,683.00</td>
                <td className='text-end px-5 py-3 border-l  border-gray-300'>-</td>
                <td className='text-end px-5 py-3 border-r border-gray-300'>-</td>
                <td className='text-start px-5 py-3'>-</td>
                <td className='text-start px-5 py-3'>(2,683.00)</td>
                <td className='text-end px-5 py-3'>-</td>
                <td className='text-end px-5 py-3'>-</td>
              </tr>
               <tr>
                <td className='text-center px-5 py-3'>45</td>
                <td className='text-start px-5 py-3'>Tin Roof</td>
                <td className='text-start px-5 py-3'>9,800.00</td>
                <td className='text-end px-5 py-3 border-l  border-gray-300'>-</td>
                <td className='text-end px-5 py-3 border-r border-gray-300'>-</td>
                <td className='text-start px-5 py-3'>-</td>
                <td className='text-start px-5 py-3'>(2,683.00)</td>
                <td className='text-end px-5 py-3'>-</td>
                <td className='text-end px-5 py-3 font-bold'>120.20</td>
              </tr>
              <tr className='totals-'>
                <td>{""}</td>
                <td>{""}</td>
                <td className="border-b-2 border-t border-double border-black py-2 px-4 font-bold">
                  12,482.00
                </td>
                <td className="border-b-2 text-end border-t border-double border-black py-2 px-4 font-bold">
                  -
                </td>
                <td className="border-b-2 text-end border-t border-double border-black py-2 px-4 font-bold">
                  -
                </td>
                 <td className="border-b-2 text-start border-t border-double border-black py-2 px-4 font-bold">
                  -
                </td>
                <td className="border-b-2 text-start border-t border-double border-black py-2 px-4 font-bold">
                  (11,845.00)
                </td>
                 <td className="border-b-2 text-end border-t border-double border-black py-2 px-4 font-bold">
                  (500.00)
                </td>
                <td className="border-b-2 text-end border-t border-double border-black py-2 px-4 font-bold">
                  (130.00)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
   </>
  )
}

export default PropertStatement