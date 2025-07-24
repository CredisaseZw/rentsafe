import AddPropertyForm from "@/components/forms/AddPropertyForm";
import Button from "@/components/general/Button";
import { Filter } from "@/components/general/Filter";
import Modal from "@/components/general/Modal";
import PropertyListTableRow from "@/components/general/PropertyListTableRow";
import Searchbox from "@/components/general/Searchbox";
import SummaryCard from "@/components/general/SummaryCard";
import usePropertyList from "@/hooks/components/usePropertyList";
import { Plus } from "lucide-react";

function PropertyLIst() {
   const {
      SummaryCards,
      filterOptions,
      selectedFilter,
      addPropertyModal,
      onSelectFilter,
      onSearchValue,
      openModal,
      closeModal,
   } = usePropertyList();

   return (
      <div className="">
         {addPropertyModal && (
            <Modal onClose={closeModal} size={"xl"} modalHeader="Add Property" allowOverflow={false}>
               <AddPropertyForm />
            </Modal>
         )}
         <div className="summary-container w-full">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
               {SummaryCards.map((card, index) => (
                  <SummaryCard key={index} subTitle={card.subTitle} value={card.value} />
               ))}
            </div>
            <div className="main-card">
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="start aligh-center">
                     <div className="flex w-full flex-row items-center p-4">
                        <Filter onFilter={onSelectFilter} activeFilter={selectedFilter} filterOptions={filterOptions} />
                     </div>
                  </div>
                  <div className="center flex p-4">
                     <Searchbox placeholder="By address, unit number or tenant" handleSearch={onSearchValue} />
                  </div>
                  <div className="flex flex-row justify-end p-4">
                     <Button onClick={openModal} className="flex flex-row gap-3">
                        <Plus size={20} className="self-center" />
                        <span className="self-center">Add Property</span>
                     </Button>
                  </div>
               </div>
               <div className="mt-6 overflow-x-auto rounded border-gray-300">
                  <table className="w-full table-auto border-collapse text-left">
                     <tbody className="">
                        <PropertyListTableRow />
                        <PropertyListTableRow />
                        <PropertyListTableRow />
                        <PropertyListTableRow />
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
}

export default PropertyLIst;
