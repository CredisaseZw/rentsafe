import React, { useState } from 'react'

// ESC BTN SHOULD CLOSE THE BTN 
function useModal() {
    let [ModalState, setModalState] = useState(false); // FALSE -> MODAL IS CLOSED, TRUE -> !! WELL YOU GET THE JIST

    let openModal =()=>{
      setModalState(true);
    }
    
    let closeModal = ()=>{
      setModalState(false)
    }
    return (
    {
      ModalState,
      openModal,
      closeModal
    }
  )
}

export default useModal