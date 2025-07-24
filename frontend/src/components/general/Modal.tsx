import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface ModalProps {
   children?: React.ReactNode;
   size: "md" | "lg" | "xl";
   allowOverflow?: boolean | false;
   modalHeader: string;
   onClose: (event?: React.MouseEvent | React.KeyboardEvent) => void;
}

Modal.defaultProps = {
   size: "md",
};

function Modal({ children, onClose, size, modalHeader }: ModalProps) {
   const modal_sizes = useRef({
      md: { width: "w-[500px]" },
      lg: { width: "w-[800px]" },
      xl: { width: "w-[1140px]" },
   });

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
         }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.body.style.overflow = "";
      };
   }, [onClose]);

   return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-10 backdrop-blur-xs`}>
         <div className={`modal relative mx-auto rounded-md border bg-white p-10 ${modal_sizes.current[size].width}`}>
            <div className="modal-container relative">
               <div className="modal-header relative mb-5">
                  <h1 className="text-PRIMARY text-2xl font-bold">{modalHeader}</h1>
                  <div className="absolute top-0 right-0">
                     <X size={25} className="self-center text-gray-500 hover:text-red-800" onClick={onClose} />
                  </div>
               </div>

               <div className="max-h-[80vh] overflow-y-auto pr-2">{children}</div>
            </div>
         </div>
      </div>
   );
}

export default Modal;
