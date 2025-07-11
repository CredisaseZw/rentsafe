import Button from '@/components/general/Button'
import { Filter } from '@/components/general/Filter'
import Pill from '@/components/general/Pill'
import Searchbox from '@/components/general/Searchbox'
import SummaryCard from '@/components/general/SummaryCard'
import usePropertyList from '@/hooks/components/usePropertyList'
import { Eye, ListFilter, Plus } from 'lucide-react'
import React,{useState} from 'react'


function PropertyLIst() {
  let {SummaryCards, filterOptions, selectedFilter, onSelectFilter, onSearchValue} = usePropertyList()

  return (
    <div className='container px-7 py-4 W-full'>
      <div className='w-full summary-container'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {
            SummaryCards.map((card, index)=>
            <SummaryCard
              key={index}
              subTitle={card.subTitle}
              value={card.value}
            />
            )
          }
        </div>
        <div className='mt-10 bg-white rounded-xl shadow p-5 w-full min-h-[75vh]'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="start aligh-center">
               <div className="flex p-4 flex-row items-center w-full ">
                  <Filter
                    onFilter={onSelectFilter}
                    activeFilter={selectedFilter}
                    filterOptions={filterOptions}
                  />
                </div>
              </div>
              <div className="flex center p-4">
                <Searchbox
                  placeholder = "By address, unit number or tenant"
                  handleSearch  = {onSearchValue}
                />
              </div>
              <div className="flex flex-row  p-4 justify-end">
                <Button className='flex flex-row gap-3 bg-PRIMARY hover:bg-primary-dark'>
                  <Plus size={20} className='self-center'/>
                  <span className='self-center'>Add Property</span>
                </Button>
              </div>  
            </div>
            <div className="overflow-x-auto rounded mt-6 border-gray-300">
              <table className="w-full table-auto text-left border-collapse">
                <tbody className=''>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">1</td>
                    <td className="border border-gray-300">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-center text-blue-900 font-semibold">
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
                          <tr className='border-t border-b border-gray-300 bg-blue-200'>
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
                   <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">1</td>
                    <td className="border border-gray-300">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-center text-blue-900 font-semibold">
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
                          <tr className='border-t border-b border-gray-300 bg-blue-200'>
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
                   <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">1</td>
                    <td className="border border-gray-300">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-center text-blue-900 font-semibold">
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
                          <tr className='border-t border-b border-gray-300 bg-blue-200'>
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
                   <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">1</td>
                    <td className="border border-gray-300">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-center text-blue-900 font-semibold">
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
                          <tr className='border-t border-b border-gray-300 bg-blue-200'>
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
                </tbody>
              </table>
            </div>

        </div>
      </div>
    </div>
  )
}

export default PropertyLIst