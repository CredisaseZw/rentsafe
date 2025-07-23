import AddPropertyForm from '@/components/forms/AddPropertyForm'
import Button from '@/components/general/Button'
import { Filter } from '@/components/general/Filter'
import Modal from '@/components/general/Modal'
import PropertyListTableRow from '@/components/general/PropertyListTableRow'
import Searchbox from '@/components/general/Searchbox'
import SummaryCard from '@/components/general/SummaryCard'
import usePropertyList from '@/hooks/components/usePropertyList'
import { Plus } from 'lucide-react'
import React,{useState} from 'react'


function PropertyLIst() {
  let {
    SummaryCards, 
    filterOptions,
    selectedFilter,
    addPropertyModal,
    onSelectFilter,
    onSearchValue,
    openModal,
    closeModal
  } = usePropertyList()

  return (
  <div className='side-main'>
    {addPropertyModal && <Modal 
        onClose={closeModal}
        size={"xl"}
        modalHeader='Add Property'
        allowOverflow = {false}>
          <AddPropertyForm/>
      </Modal>}
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
                <Button onClick={openModal} className='flex flex-row gap-3 bg-PRIMARY hover:bg-primary-dark'>
                  <Plus size={20} className='self-center'/>
                  <span className='self-center'>Add Property</span>
                </Button>
              </div>  
            </div>
            <div className="overflow-x-auto rounded mt-6 border-gray-300">
              <table className="w-full table-auto text-left border-collapse">
                <tbody className=''>
                  <PropertyListTableRow/>
                  <PropertyListTableRow/>
                  <PropertyListTableRow/>
                  <PropertyListTableRow/>
                </tbody>
              </table>
            </div>

        </div>
      </div>
    </div>
  )
}

export default PropertyLIst