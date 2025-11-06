import type { BranchFull, IndividualMinimal } from "@/interfaces";
import type { InvoicePreview, InvoiceTotals } from "@/types";
import { useRef, useState } from "react";

export default function useAddInvoiceForm(){
  const [searchItem, setSearchItem] = useState("");
  const rowsRef = useRef<{
    getRows: () => InvoicePreview[]
    getTotals : ()=> InvoiceTotals
  }>(null)

  const [formData, setFormData] = useState({
      biller_id : Number(""),
      biller_name : "",
      biller_type: "",
      invoice_type : ""
  })

  const onSelectBiller = (item: IndividualMinimal | BranchFull)=>{
      if ("first_name" in item) {
        setFormData((prev) => ({
        ...prev,
        biller_id: item.id,
        biller_name: `${item.first_name} ${item.last_name}`,
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        biller_id: item.company.id,
        biller_type: item.company.registration_name,
      }));
      return
  }

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const rows = rowsRef.current ? rowsRef.current.getRows() : [];
    const totals  = rowsRef.current?.getTotals()

    console.log(rows)
    console.log(totals)
  }

 
  return { 
    formData,
    searchItem,
    rowsRef,
    onSave,
    setFormData,
    setSearchItem,
    onSelectBiller,
  }
}