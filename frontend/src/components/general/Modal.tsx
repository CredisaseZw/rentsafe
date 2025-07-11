import { X } from 'lucide-react'
import React from 'react'

interface ModalProps {
  children? : React.ReactNode,
  onClose : React.MouseEventHandler<SVGSVGElement>
}

function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
        <div className='modal'>
            <div className="modal-container relative rounded-md border p-5 min-h-[50vh] bg-white min-w-150">
                <div className='absolute top-0 right-0 mt-4 mr-4'>
                    <X 
                      size={25}
                      className='text-gray-500 hover:text-red-800'
                      onClick={onClose}
                    />
                </div>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal