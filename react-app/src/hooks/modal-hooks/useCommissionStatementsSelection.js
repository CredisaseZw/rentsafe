import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function useCommissionStatementsSelection() {
  const [show, setShow] = useState(false);
  const [periodSelection, setPeriodSelection] = useState('month');

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    Inertia.visit(reverseUrl('commission_statement'), { data });
    setShow(false);
  }

  return {
    show,
    openModal,
    closeModal,
    handleSubmit,
    periodSelection,
    setPeriodSelection,
  };
}
