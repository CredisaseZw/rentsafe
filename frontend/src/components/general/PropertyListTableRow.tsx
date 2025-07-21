import React from 'react'
import Button from './Button'
import { Eye } from 'lucide-react'
import Pill from './Pill'

function PropertyListTableRow() {
  return (
     <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 border border-gray-300">1</td>
        <td className="border border-gray-300">
            <table className="table-auto w-full">
            <tbody>
                <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-200">
                    8 Floor, West Wing, Club chamber, Cnr 3rd/N, Mandela Str, CBD, Harare, Zimbabwe
                </td>
                </tr>
                <tr>
                <td colSpan={2} className='border-t border-r border-gray-300 px-4 py-2'>
                    <Pill variant="success">Commercial Offices</Pill>
                </td>
                <td colSpan={2} className='px-4 py-2 border-t border-l border-gray-300'>
                    <span>4-Offices</span>  
                </td>
                </tr>
                <tr className='border-t border-b border-gray-300'>
                    <td className='px-4 py-2 border-r font-medium text-center'>Status</td>
                    <td className='px-4 py-2 border-r font-medium text-center'>Tenant</td>
                    <td className='px-4 py-2 border-r font-medium text-center'>Monthly Rent</td>
                    <td className='px-4 py-2 font-medium text-center text-center'>Lease Expiry</td>
                </tr>
                <tr>
                    <td className='px-4 py-2 text-center'>Occupied</td>
                    <td className='px-4 py-2 text-center'>Edward Attorneys</td>
                    <td className='px-4 py-2 text-center'>US1,100</td>
                    <td className='px-4 py-2 text-center'>31-DEC-25</td>
                </tr>
            </tbody>
            </table>
        </td>
        <td className="px-4 py-2 border border-gray-300">
            <Button className='bg-PRIMARY hover:bg-primary-dark flex flex-row gap-3'>
                <Eye size={18} className='self-center'/>
                <span className='self-center'>View Lease</span>
            </Button>
        </td>
    </tr>
                
  )
}

export default PropertyListTableRow