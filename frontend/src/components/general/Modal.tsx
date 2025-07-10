import { X } from 'lucide-react'
import React from 'react'

function Modal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
        <div className='modal'>
            <div className="modal-container rounded-md border p-4 min-h-[50vh] bg-white min-w-150">
                <div className='absolute'>
                    <X className='' size={18}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal