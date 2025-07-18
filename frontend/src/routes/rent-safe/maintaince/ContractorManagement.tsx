import React from 'react'

function ContractorManagement() {
  return (
    <div className='side-main'>
        <Header title = {"Contractor Management"}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-5">
          <GlobalSummaryCard
            value='10'
            subTitle='Total Contractors'
            layoutScheme={{
              icon : User,
              color : "amber"
            }}
          />
          <GlobalSummaryCard
            value='10'
            subTitle='Active'
            layoutScheme={{
              icon : Check,
              color : "green"
            }}
          />
          <GlobalSummaryCard
            value='10'
            subTitle="Unactive"
            layoutScheme={{
              icon : X,
              color : "red"
            }}
          />
        </div>
        <div className='mt-5 p-5 rounded-xl shadow w-full bg-white'>
          <div className="section_header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-auto">
                <Searchbox
                  placeholder="Contractor Name, Industry, Contact Person"
                  handleSearch={() => {}}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto flex flex-row gap-3 justify-center">
                  <Plus size={18} className="self-center" />
                  Add Contractor
                </Button>
              </div>
          </div>

            <table className='w-full'>
              <tbody>
                <tr className="w-full border-t border-b border-gray-300 text-sm">
                  <td className='border-r border-gray-300 px-5 py-3 text-center'>1</td>
                  <td>
                    <table className='w-full'>
                      <tbody>
                        <tr>
                          <td colSpan={2} className='text-center'>
                            <div className='flex flex-column text-center'>
                                <span className='font-bold text-PRIMARY'>Cool Air</span>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className=''>
                            <div className='flex flex-col'>
                                <span>Contact Person</span>
                                <span>Kai Cent</span>
                            </div>
                          </td>
                          <td className=''>
                            <div className='flex flex-col'>
                                <span>Contact Person</span>
                                <span>Kai Cent</span>
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
              </tbody>
            </table>


        </div>
    </div>
    <div className='side-main'>
        <Header title = {"Contractor Management"}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-5">
          <GlobalSummaryCard
            value='10'
            subTitle='Total Contractors'
            layoutScheme={{
              icon : User,
              color : "amber"
            }}
          />
          <GlobalSummaryCard
            value='10'
            subTitle='Active'
            layoutScheme={{
              icon : Check,
              color : "green"
            }}
          />
          <GlobalSummaryCard
            value='10'
            subTitle="Unactive"
            layoutScheme={{
              icon : X,
              color : "red"
            }}
          />
        </div>
        <div className='mt-5 p-5 rounded-xl shadow w-full bg-white'>
          <div className="section_header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-auto">
                <Searchbox
                  placeholder="Contractor Name, Industry, Contact Person"
                  handleSearch={() => {}}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto flex flex-row gap-3 justify-center">
                  <Plus size={18} className="self-center" />
                  Add Contractor
                </Button>
              </div>
          </div>

            <table className='w-full'>
              <tbody>
                <tr className="w-full border-t border-b border-gray-300 text-sm">
                  <td className='border-r border-gray-300 px-5 py-3 text-center'>1</td>
                  <td>
                    <table className='w-full'>
                      <tbody>
                        <tr>
                          <td colSpan={2} className='text-center'>
                            <div className='flex flex-column text-center'>
                                <span className='font-bold text-PRIMARY'>Cool Air</span>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className=''>
                            <div className='flex flex-col'>
                                <span>Contact Person</span>
                                <span>Kai Cent</span>
                            </div>
                          </td>
                          <td className=''>
                            <div className='flex flex-col'>
                                <span>Contact Person</span>
                                <span>Kai Cent</span>
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
              </tbody>
            </table>


        </div>
    </div>
  )
}

export default ContractorManagement
