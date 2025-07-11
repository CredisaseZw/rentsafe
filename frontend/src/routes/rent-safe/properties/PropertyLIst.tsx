import { HouseIcon } from 'lucide-react'
import React from 'react'

function PropertyLIst() {
  return (
    <div className='container px-7 py-4 W-full'>
      <div className='w-full summary-container'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white px-4 py-8 shadow rounded-xl p-4">
            <div className="flex flex-row">
              <div className="icon-container self-center bg-green-200 p-4 rounded-full mr-5">
                  <HouseIcon className='text-green-800'/>
              </div>
              <div className="flex flex-col">
                <h1 className='font-semibold text-4xl text-gray-700'>75</h1>
                <span className='mt-2 text-sm uppercase'>TOTAL PROPERTIES</span>
              </div>
            </div>
          </div>
         
        </div>

      </div>
    </div>
  )
}

export default PropertyLIst