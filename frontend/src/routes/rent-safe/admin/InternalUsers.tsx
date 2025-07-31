import AddInternalUsersForm from "@/components/forms/AddInternalUsersForm";
import Button from "@/components/general/Button";
import Header from "@/components/general/Header";
import Modal from "@/components/general/Modal";
import Searchbox from "@/components/general/Searchbox";
import { TableBase } from "@/components/general/TableBase";
import { TableRow, TableCell } from "@/components/ui/table";
import useInternalUsers from "@/hooks/components/useInternalUsers";
import { Eye, Plus, Trash } from "lucide-react";

export default function InternalUsers() {
   const { handleUserSearch, closeodal, openModal, modalVisible } = useInternalUsers();
   const headers = [
      {
         name: "First Name",
         textAlign: "left",
      },
      {
         name: "Last Name",
         textAlign: "left",
      },
      {
         name: "Access Level",
         textAlign: "left",
      },
      {
         name: "Email",
         textAlign: "left",
      },
      {
         name: "Actions",
         textAlign: "center",
      },
   ];
   const bodyChildren = [
      {
         email: "john@doe.com",
         lastName: "Doe",
         firstName: "John",
         access_level: "admin",
      },
      {
         email: "jane@smith.com",
         lastName: "Smith",
         firstName: "Jane",
         access_level: "user",
      },
      {
         email: "mark@lee.com",
         lastName: "Lee",
         firstName: "Mark",
         access_level: "admin",
      },
      {
         email: "sarah@williams.com",
         lastName: "Williams",
         firstName: "Sarah",
         access_level: "user",
      },
      {
         email: "david@brown.com",
         lastName: "Brown",
         firstName: "David",
         access_level: "admin",
      },
      {
         email: "emily@johnson.com",
         lastName: "Johnson",
         firstName: "Emily",
         access_level: "user",
      },
   ];

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
               <TableBase headers={headers} isLoading={Boolean(bodyChildren === null)}>
                  {bodyChildren.map((row, index) => {
                     const baseCellClass = "border-color border-r";
                     return (
                        <TableRow key={index}>
                           <TableCell className={`${baseCellClass}`}>{row.lastName}</TableCell>
                           <TableCell className={`${baseCellClass}`}>{row.firstName}</TableCell>
                           <TableCell className={`${baseCellClass}`}>{row.access_level}</TableCell>
                           <TableCell className={`${baseCellClass}`}>{row.email}</TableCell>
                           <TableCell className={``}>
                              <div className="flex flex-row items-center justify-center gap-3">
                                 <Eye size={18} className="text-gray-800 dark:text-white" />
                                 <Trash size={18} className="text-red-700" />
                              </div>
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBase>
            </div>
         </div>
      </div>
   );
}
