import html2pdf from 'html2pdf.js';
import { useRef, useState } from 'react';

export default function usePropertyInspection() {
  const [isLoading, setIsLoading] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState('residential');
  const printContentRef = useRef();

  function printForm() {
    const element = printContentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: 'modal-content.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' },
      })
      .save();
  }

  function handleResidentialSubmission(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(data);
  }

  return {
    activeTab,
    isLoading,
    wasSuccessful,
    printContentRef,
    printForm,
    setWasSuccessful,
    handleResidentialSubmission,
    showCommercial: () => setActiveTab('commercial'),
    showResidential: () => setActiveTab('residential'),
  };
}
