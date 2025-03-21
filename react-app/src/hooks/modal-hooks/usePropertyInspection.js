import axios from "axios";
import html2pdf from "html2pdf.js";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function usePropertyInspection() {
  const [isLoading, setIsLoading] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState("residential");
  const printContentRef = useRef();

  function printForm() {
    const element = printContentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  }

  function handleResidentialSubmission(e) {
    e.preventDefault();
    setWasSuccessful(false);
    setIsLoading(true);

    html2pdf()
      .from(printContentRef.current)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
        // pagebreak: { mode: ['avoid-all', 'css'] },
      })
      .outputPdf("blob")
      .then((pdfBlob) => {
        const formData = new FormData();
        formData.append("inspection_pdf", pdfBlob, "residential_inspection.pdf");
        console.log(formData);
        return axios.post(reverseUrl("save_inspection_document"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .then((res) => {
        toast.success(userFriendlyErrorOrResponse(res));
        setWasSuccessful(true);
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(userFriendlyErrorOrResponse(e));
        setWasSuccessful(false);
        setIsLoading(false);
      });
  }

  return {
    activeTab,
    isLoading,
    wasSuccessful,
    printContentRef,
    printForm,
    setWasSuccessful,
    handleResidentialSubmission,
    showCommercial: () => setActiveTab("commercial"),
    showResidential: () => setActiveTab("residential"),
  };
}
