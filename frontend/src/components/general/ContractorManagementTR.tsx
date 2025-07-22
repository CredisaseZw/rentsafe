import React from 'react'
import { Check, MapPin, Plus, User, X , Phone, Smartphone, Mail} from 'lucide-react'


function ContractManagementTR() {
  return (
      <tr className="w-full border-t border-b border-gray-300 text-sm">
        <td className='border-r border-gray-300 px-5 py-3 text-center'>1</td>
        <td className='border-r border-gray-300'>
        <table className='w-full'>
            <tbody>
            <tr className='border-b  border-gray-300 '>
                <td colSpan={2} className="text-center px-5 py-3">
                <div className="flex flex-col items-center w-full">
                    <h6 className="font-bold text-lg text-PRIMARY">Cool Air</h6>
                    <p className="flex items-center gap-1">
                    <MapPin size={15}/>
                    2 Hala, Graniteside Harare, Zimbabwe
                    </p>
                    <div className='flex flex-row gap-5 mt-3'>
                    <p className="flex items-center gap-1">
                        <Phone size={15}/>
                        0242704856
                    </p>
                    <p className="flex items-center gap-1">
                        <Smartphone size={15}/>
                        07188522555
                    </p>
                    <p className="flex items-center gap-1">
                        <Mail size={15}/>
                        ksink@gmsil.com
                    </p>
                    </div>
                </div>
                </td>
            </tr>
            <tr>
                <td className="w-1/2 px-5 py-3 border-r border-gray-300 align-top">
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-PRIMARY">Contact Person</span>
                    <div className="flex flex-col gap-1">
                    <span className='font-bold'>Kai Cent</span>
                    <p className="flex items-center gap-1">
                        <Smartphone size={15} />
                        07188522555
                    </p>
                    <p className="flex items-center gap-1">
                        <Mail size={15}/>
                        ksink@gmsil.com
                    </p>
                    </div>
                </div>
                </td>
                <td className="w-1/2 px-5 py-3 align-top">
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-PRIMARY">Company Information</span>
                    <div className='flex flex-row gap-2'>
                        <p className="flex items-center font-bold">
                        Industry:  
                        </p>
                        <p className="flex items-center gap-1">
                        HVAC 
                        </p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p className="flex items-center font-bold">
                        License:  
                        </p>
                        <p className="flex items-center">
                        CM-4685-4555 
                        </p>
                    </div>  
                </div>
                </td>
            </tr>
            </tbody>  
        </table>                    
        </td>
        <td>
        <select name="" id="">
            <option value="active" selected>Active</option>
            <option value="deactive" selected>Deactive</option>
        </select>
        </td>
    </tr>
  )
}

export default ContractManagementTR