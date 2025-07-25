import { useState } from "react";

// ESC BTN SHOULD CLOSE THE BTN
function useModal() {
   const [ModalState, setModalState] = useState(false); // FALSE -> MODAL IS CLOSED, TRUE -> !! WELL YOU GET THE JIST

   const openModal = () => {
      setModalState(true);
   };

   const closeModal = () => {
      setModalState(false);
   };
   return {
      ModalState,
      openModal,
      closeModal,
   };
}

export default useModal;
