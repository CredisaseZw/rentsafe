import AddInternalUsersForm from "@/components/forms/AddInternalUsersForm";
import Button from "@/components/general/Button";
import Header from "@/components/general/Header";
import Modal from "@/components/general/Modal";
import Searchbox from "@/components/general/Searchbox";
import { TableBase } from "@/components/general/TableBase";
import useInternalUsers from "@/hooks/components/useInternalUsers";
import { Plus } from "lucide-react";

export default function InternalUsers() {
   const { handleUserSearch, closeodal, openModal, modalVisible } = useInternalUsers();

   return (
      <div className="relative">
         {modalVisible && (
            <Modal size="lg" modalHeader="Add Internal User" onClose={closeodal}>
               <AddInternalUsersForm />
            </Modal>
         )}

         <Header title="Internal Users" />
         <div className="main-card mt-5">
            <div className="card-header">
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Searchbox handleSearch={handleUserSearch} placeholder="Full name or email ..." />
                  <div className="flex justify-end">
                     <Button asChild onClick={openModal}>
                        <Plus size={15} />
                        Add Inteneral User
                     </Button>
                  </div>
               </div>
            </div>
            <div className="mt-10 overflow-x-auto">
               <TableBase />
            </div>
         </div>
      </div>
   );
}
