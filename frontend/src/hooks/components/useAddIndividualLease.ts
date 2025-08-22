import { useState } from "react"

function useAddIndividualLease() {
  const [isOpen, setShowModal] = useState(false);
  return {
    isOpen, setShowModal
  }
}

export default useAddIndividualLease