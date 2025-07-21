import AddTodoForm from "@/components/general/AddTodoForm";
import Button from "@/components/general/Button";
import Modal from "@/components/general/Modal";
import Pill from "@/components/general/Pill";
import useModal from "@/hooks/components/useModal";
import { ChevronRight, Plus } from "lucide-react";
import React from "react";


// REVISIT THIS PAGE WHEN THE PICTURE IS CLEAR
export default function Todo() {
   const { ModalState, openModal, closeModal } = useModal();

   return <div className="container px-7 py-4 W-full ">
     {ModalState && 
         <Modal onClose={closeModal}>
            <AddTodoForm/>
         </Modal>
      }
      <div className="to-do-main w-full">
         <div className="header">
            <h1 className="font-semibold text-4xl text-gray-700">10 JULY 2025</h1>
         </div>
         <div className="flex flex-col md:flex-row w-full gap-4 mt-8">
            <div className="w-full md:w-1/2 bg-white">
               <div className="mb-5">
               <Button
                  onClick={openModal}
                  className="w-full flex flex-row justify-center gap-3 items-center">
                  <Plus size={18} className="self-center" />
                  Add To-Do
               </Button>
               </div>
               <div className="lists-container">
                  <div className="list flex flex-row justify-between w-full py-3 px-2 border-b hover:bg-gray-200">
                     <div className="flex flex-row gap-4">
                        <span className="self-center text-gray-500 text-sm">10 July 2025</span>
                        <span>Functionality</span>
                        <Pill variant="danger">High priority</Pill>
                     </div>
                     <div>
                        <ChevronRight />
                     </div>
                  </div>
                   <div className="list flex flex-row justify-between w-full py-3 px-2 border-b hover:bg-gray-200">
                     <div className="flex flex-row gap-4">
                        <span className="self-center text-gray-500 text-sm">10 July 2025</span>
                        <span>Functionality</span>
                        <Pill variant="danger">High priority</Pill>
                     </div>
                     <div>
                        <ChevronRight />
                     </div>
                  </div>
                   <div className="list flex flex-row justify-between w-full py-3 px-2 border-b hover:bg-gray-200">
                     <div className="flex flex-row gap-4">
                        <span className="self-center text-gray-500 text-sm">10 July 2025</span>
                        <span>Functionality</span>
                        <Pill variant="danger">High priority</Pill>
                     </div>
                     <div>
                        <ChevronRight />
                     </div>
                  </div>
                   <div className="list flex flex-row justify-between w-full py-3 px-2 border-b hover:bg-gray-200">
                     <div className="flex flex-row gap-4">
                        <span className="self-center text-gray-500 text-sm">10 July 2025</span>
                        <span>Functionality</span>
                        <Pill variant="danger">High priority</Pill>
                     </div>
                     <div>
                        <ChevronRight />
                     </div>
                  </div>
               </div>
            </div>

            <div className="w-full md:w-1/2 min-h-[60vh] bg-gray-100 rounded-xl p-6">
               LIST INFORMATIKM
            </div>
         </div>
      </div>
   </div>;
}
