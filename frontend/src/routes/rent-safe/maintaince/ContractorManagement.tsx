import Button from "@/components/general/Button";
import ContractorManagementTable from "@/components/general/ContractorManagementTable";
import GlobalSummaryCard from "@/components/general/globalSummaryCard";
import Header from "@/components/general/Header";
import Searchbox from "@/components/general/Searchbox";
import { Check, Plus, User, X } from "lucide-react";
import Modal from "@/components/general/Modal";
import useContractorManagement from "@/hooks/components/useContractorManagement";
import AddContractorForm from "@/components/forms/AddContractorForm ";

function ContractorManagement() {
   const { openModal, closeModal, isModal } = useContractorManagement();

   return (
      <div className="">
         {isModal && (
            <Modal onClose={closeModal} size={"xl"} modalHeader="Add Contractor" allowOverflow={false}>
               <AddContractorForm />
            </Modal>
         )}
         <Header title={"Contractor Management"} />
         <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <GlobalSummaryCard
               value="10"
               subTitle="Total Contractors"
               layoutScheme={{
                  icon: User,
                  color: "amber",
               }}
            />
            <GlobalSummaryCard
               value="10"
               subTitle="Active"
               layoutScheme={{
                  icon: Check,
                  color: "green",
               }}
            />
            <GlobalSummaryCard
               value="10"
               subTitle="Unactive"
               layoutScheme={{
                  icon: X,
                  color: "purple",
               }}
            />
         </div>
         <div className="mt-5 w-full rounded-xl bg-white p-5 shadow">
            <div className="section_header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="w-full sm:w-auto">
                  <Searchbox placeholder="Contractor Name, Industry, Contact Person" handleSearch={() => {}} />
               </div>
               <div className="w-full sm:w-auto">
                  <Button className="flex w-full flex-row justify-center gap-3 sm:w-auto" onClick={openModal}>
                     <Plus size={18} className="self-center" />
                     Add Contractor
                  </Button>
               </div>
            </div>
            <ContractorManagementTable />
         </div>
      </div>
   );
}

export default ContractorManagement;
