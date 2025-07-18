import { X } from 'lucide-react'
import React, { useEffect , useRef} from 'react'

interface ModalProps {
  children? : React.ReactNode,
  size: "md" | "lg" | "xl",
  allowOverflow : boolean | false,
  modalHeader  : string,
  onClose : (event?: React.MouseEvent | React.KeyboardEvent) => void;
}

Modal.defaultProps = {
  size : "md"
}

function Modal({ children, onClose, size, allowOverflow, modalHeader}: ModalProps) {
    let modal_sizes = useRef({
      "md": {width: "w-[500px]"},
      "lg": {width: "w-[800px]"},
      "xl": {width: "w-[1140px]"}
    });

useEffect(() => {
  let handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  document.body.style.overflow ="hidden"
  
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "";
  };
}, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs ${allowOverflow && "overflow-y-auto" }`}>
        <div
          className={`modal rounded-md border p-10 bg-white ${allowOverflow ? "mt-50" : ""} ${modal_sizes.current[size].width}`}>
            <div className="modal-container relative ">
                <div className='modal-header mb-5 relative'>
                    <h1 className='font-bold text-2xl text-PRIMARY'>{modalHeader}</h1>
                    <div className='absolute top-0 right-0'>
                      <X 
                        size={25}
                        className='text-gray-500 self-center hover:text-red-800'
                        onClick={onClose}
                      />
                    </div>
                </div>
            
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal