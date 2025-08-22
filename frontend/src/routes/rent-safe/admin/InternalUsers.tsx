import AddInternalUsersForm from "@/components/forms/AddInternalUsersForm";
import Button from "@/components/general/Button";
import Header from "@/components/general/Header";
import Modal from "@/components/general/Modal";
import Searchbox from "@/components/general/Searchbox";
import { TableBase } from "@/components/general/TableBase";
import { TableRow, TableCell } from "@/components/ui/table";
import useInternalUsers from "@/hooks/components/useInternalUsers";
import { Eye, Plus, Trash } from "lucide-react";
import { useGetInternalUserClients } from "@/hooks/apiHooks/useGetInternalClients";
import { useEffect, useState } from "react";
import type { Clients, DataInternalUser } from "@/types";
import useGetUserId from "@/hooks/components/useGetUserID";

export default function InternalUsers() {
   const { handleUserSearch, closeModal, openModal, headers, modalVisible } = useInternalUsers();
   const [clients, setClients] = useState<Clients>([]);
   const { data, isLoading, isError } = useGetInternalUserClients(useGetUserId());

   useEffect(() => {
      if (data && Array.isArray(data)) {
         const trimmedClients: Clients = data.map((client: DataInternalUser) => ({
            id: client.id,
            firstName: client.first_name,
            lastName: client.last_name,
            email: client.email,
            accessLevel: client.roles[0].name,
         }));
         setClients(trimmedClients);
      }
   }, [data]);

   return (
      <div className="relative">
         {modalVisible && (
            <Modal size="lg" modalHeader="Add Internal User" onClose={closeModal}>
               <AddInternalUsersForm successCallbackFN={(status: boolean) => { if (status) closeModal(); }} />
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
                        Add Internal User
                     </Button>
                  </div>
               </div>
            </div>

            <div className="mt-10 overflow-x-auto">
               <TableBase headers={headers} isLoading={isLoading} isError={isError}>
                  {clients.length > 0
                     ? clients.map((row, index) => {
                          const baseCellClass = "border-color border-r";
                          return (
                             <TableRow key={index}>
                                <TableCell className={baseCellClass}>{row.lastName}</TableCell>
                                <TableCell className={baseCellClass}>{row.firstName}</TableCell>
                                <TableCell className={baseCellClass}>{row.accessLevel}</TableCell>
                                <TableCell className={baseCellClass}>{row.email}</TableCell>
                                <TableCell>
                                   <div className="flex flex-row items-center justify-center gap-3">
                                      <Eye size={18} className="text-gray-800 dark:text-white" />
                                      <Trash size={18} className="text-red-700" />
                                   </div>
                                </TableCell>
                             </TableRow>
                          );
                       })
                     : !isLoading &&
                       clients.length == 0 && (
                          <TableRow>
                             <TableCell colSpan={headers.length}>
                                <div className="flex flex-col items-center justify-center gap-3 py-4 text-gray-600">
                                   No clients registered in the system yet.
                                   <Button asChild onClick={openModal}>
                                      <Plus size={15} />
                                      Add Internal User
                                   </Button>
                                </div>
                             </TableCell>
                          </TableRow>
                       )}
               </TableBase>
            </div>
         </div>
      </div>
   );
}
