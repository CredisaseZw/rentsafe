import React from 'react'
import GlobalSummaryCard from '../properties/globalSummaryCard'
import { User, Building, BadgeCent, Send, Printer} from 'lucide-react'
import Button from '@/components/general/Button'
import PropertyStatementContainer from '@/components/general/PropertyStatementContainer'
import { Document, Page, Text, View, PDFDownloadLink } from '@react-pdf/renderer';

function LandlordStatements() {
 // let {_} = useLandlordStatement();

  return (
    <div className='container px-7 py-4 W-full'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 ">
            <GlobalSummaryCard
                value='10'
                subTitle='Landlords'
                layoutScheme={{
                  icon : User,
                  color : "green"
                }}
            />
            <GlobalSummaryCard
                value='15'
                subTitle='Properties'
                layoutScheme={{
                  icon : Building,
                  color : "amber"
                }}
            />
            <GlobalSummaryCard
                valueAsChild = {true}
                value= {<div className='flex flex-col gap-2'>
                    <span className='font-semibold text-md text-gray-700'>US$36,366,3</span>
                    <span className='font-semibold text-md text-gray-700'>ZWL$36,366,3</span>                  
                </div>}
                subTitle='Rent Owing'
                layoutScheme={{
                  icon : BadgeCent,
                  color : "purple"
                }}
            />
        </div>
      
      <div className="w-full flex justify-center">
        <div className='mt-10 bg-white rounded-xl shadow p-5 w-fit h-fit'>
          <h1 className='text-center font-bold text-2xl text-gray-700'>Selection</h1>
          <div className='flex justify-center mt-5'>
              <form method="post" className="w-[800px]">
                <div className='flex flex-row gap-5 justify-between w-full'>
                   <div className='flex flex-row gap-3 w-1/2 '>
                      <h6 className='font-bold self-center'>Landlord</h6>
                      
                      <div className='flex flex-row gap-2 flex-1'>
                        <label htmlFor="" className='self-center'>From:</label>
                        <select required name="from" id="" className='input-default w-full'>
                          <option value="" selected>All</option>
                        </select>
                      </div>
                    </div>

                    <div className='flex flex-row gap-2 w-1/2'>
                        <label htmlFor="" className='self-center'>To:</label>
                        <select required name="to" id="" className='input-default w-full'>
                          <option value="" selected>All</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-row gap-3 justify-between w-full mt-10'>
                   <div className='flex flex-row gap-3 w-1/2 '>
                      <h6 className='font-bold self-center'>Property</h6>
                      
                      <div className='flex flex-row gap-2 flex-1'>
                        <label htmlFor="" className='self-center'>From:</label>
                        <select required name="pfrom" id="" className='input-default w-full'>
                          <option value="" selected>All</option>
                        </select>
                      </div>
                    </div>

                    <div className='flex flex-row gap-2 w-1/2'>
                        <label htmlFor="" className='self-center'>To:</label>
                        <select required name="pto" id="" className='input-default w-full'>
                          <option value="" selected>All</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-row gap-5 justify-between w-full mt-10'>
                    <div className='flex flex-row gap-3 w-1/4 '>
                      <h6 className='font-bold self-center'>Year</h6>
    
                        <select required name="year" id="" className='input-default w-full'>
                          <option value="" selected>2025</option>
                        </select>
                    </div>
                    <div className='flex flex-row gap-2 w-1/4'>
                        <label htmlFor="" className=' font-bold self-center'>Month</label>
                        <select required name="month" id="" className='input-default w-full'>
                          <option value="" selected>All</option>
                        </select>
                    </div>
                    <div className='flex flex-row gap-3 w-1/4 '>
                      <h6 className='font-bold self-center'>Currency</h6>

                      <select required name="year" id="" className='input-default w-full'>
                        <option value="USD" selected>USD</option>
                        <option value="ZWD" selected>USD</option>
                      </select>
                    </div>
                </div>
                <div className='flex flex-row justify-end mt-5'>
                    <Button type='submit' className='flex flex-row gap-3'>
                        <Send size={18} className='self-center'/>
                        Submit
                    </Button>
                </div>
            </form>
          </div>
        </div>
      </div>
  
      <div className='mt-10 bg-white rounded-xl shadow p-5 w-full min-h-[25vh]' >
        <div className="bg-blue-200 p-4 w-full rounded text-center"><span className='font-bold text-PRIMARY'>Landlord Property Statement</span></div>
        <PropertyStatementContainer/>
      </div>
    </div>
  )
}

export default LandlordStatements