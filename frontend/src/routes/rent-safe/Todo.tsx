//import AddTodoForm from "@/components/forms/AddTodoForm";
import Button from "@/components/general/Button";
//import Modal from "@/components/general/Modal";
import Pill from "@/components/general/Pill";
import useModal from "@/hooks/components/useModal";
import { ChevronRight, Plus } from "lucide-react";

// REVISIT THIS PAGE WHEN THE PICTURE IS CLEAR
export default function Todo() {
   const { openModal } = useModal();

   return (
      <div className="W-full container px-7 py-4">
         {/*  {ModalState && 
         <Modal onClose={closeModal}>
            <AddTodoForm/>
         </Modal>
      } */}
         <div className="to-do-main w-full">
            <div className="header">
               <h1 className="text-4xl font-semibold text-gray-700">10 JULY 2025</h1>
            </div>
            <div className="mt-8 flex w-full flex-col gap-4 md:flex-row">
               <div className="w-full bg-white md:w-1/2">
                  <div className="mb-5">
                     <Button onClick={openModal} className="flex w-full flex-row items-center justify-center gap-3">
                        <Plus size={18} className="self-center" />
                        Add To-Do
                     </Button>
                  </div>
                  <div className="lists-container">
                     <div className="list flex w-full flex-row justify-between border-b px-2 py-3 hover:bg-gray-200">
                        <div className="flex flex-row gap-4">
                           <span className="self-center text-sm text-gray-500">10 July 2025</span>
                           <span>Functionality</span>
                           <Pill variant="danger">High priority</Pill>
                        </div>
                        <div>
                           <ChevronRight />
                        </div>
                     </div>
                     <div className="list flex w-full flex-row justify-between border-b px-2 py-3 hover:bg-gray-200">
                        <div className="flex flex-row gap-4">
                           <span className="self-center text-sm text-gray-500">10 July 2025</span>
                           <span>Functionality</span>
                           <Pill variant="danger">High priority</Pill>
                        </div>
                        <div>
                           <ChevronRight />
                        </div>
                     </div>
                     <div className="list flex w-full flex-row justify-between border-b px-2 py-3 hover:bg-gray-200">
                        <div className="flex flex-row gap-4">
                           <span className="self-center text-sm text-gray-500">10 July 2025</span>
                           <span>Functionality</span>
                           <Pill variant="danger">High priority</Pill>
                        </div>
                        <div>
                           <ChevronRight />
                        </div>
                     </div>
                     <div className="list flex w-full flex-row justify-between border-b px-2 py-3 hover:bg-gray-200">
                        <div className="flex flex-row gap-4">
                           <span className="self-center text-sm text-gray-500">10 July 2025</span>
                           <span>Functionality</span>
                           <Pill variant="danger">High priority</Pill>
                        </div>
                        <div>
                           <ChevronRight />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="min-h-[60vh] w-full rounded-xl bg-gray-100 p-6 md:w-1/2">LIST INFORMATIKM</div>
            </div>
         </div>
      </div>
   );
}
