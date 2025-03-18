import html2pdf from "html2pdf.js";
import { usePage } from "@inertiajs/inertia-react";
import { useState, useRef } from "react";
import { formatDetailedTenantStatementData } from "../../utils/formatting";

export default function useDetailedStatement() {
  const {
    detailed_statement: statement,
    tenant_details: tenant,
    monthly_payments: payments,
    missed_payments: invoices,
  } = usePage().props;

  const modalContentRef = useRef();
  const [show, setShow] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [details, setDetails] = useState({ lease_id: tenant.lease_id });

  const cleanedData = formatDetailedTenantStatementData(payments, invoices);
  const handleClose = () => setShow(false);

  function handlePrintToPdf() {
    const element = modalContentRef.current;
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

  console.log({ details, payments, invoices });

  return {
    show,
    tenant,
    details,
    statement,
    showReceipt,
    cleanedData,
    modalContentRef,
    setShow,
    setDetails,
    handleClose,
    setShowReceipt,
    handlePrintToPdf,
  };
}
