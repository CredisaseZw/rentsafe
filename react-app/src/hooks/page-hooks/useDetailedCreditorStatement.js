import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function useDetailedCreditorStatement() {
  const contentRef = useRef();

  const handlePrintToPdf = () => {
    const element = contentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  };

  return {
    contentRef,
    handlePrintToPdf,
  };
}
