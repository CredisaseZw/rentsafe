import type { BranchFull, IndividualMinimal } from "@/interfaces";
import { getCurrentDate, handleAxiosError, validateInvoices } from "@/lib/utils";
import type { Invoice, InvoicePreview, InvoiceTotals, Payload } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useRef, useState } from "react";
import useClient from "../general/useClient";
import { MODES } from "@/constants";
import { toast } from "sonner";

export default function useAddInvoiceForm(){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useClient();
  const rowsRef = useRef<{
    getRows: () => InvoicePreview[]
    getTotals : ()=> InvoiceTotals
  }>(null)

  const [formData, setFormData] = useState({
    biller_id : 0,
    biller_name : "",
    biller_type: "individual",
    biller_phone : "",
    biller_email : "",
    biller_address : "",
    biller_vat_no : "",
    biller_tin_number : "",
    invoice_type : "fiscal"
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

  const onSave = (
    e: React.FormEvent<HTMLFormElement>,
    mutate : UseMutationResult<any, Error, Payload, unknown>
  ) => {  
    e.preventDefault();
    const mode = "create";
    const rows = rowsRef.current ? rowsRef.current.getRows() : [];
    const totals = rowsRef.current?.getTotals();
    if(validateInvoices(rows, formData)) return;

    const ITEMS = rows.map((item) => ({ sales_item_id: Number(item.salesItem), quantity: Number(item.quantity), }));
    const PayloadData = {
      invoice_type: formData.invoice_type,
      is_individual: formData.biller_type === "individual",
      customer_id: formData.biller_id,
      currency_id: totals?.currency_id,
      discount: -Number(totals?.discount || 0),
      items: ITEMS,
      sale_date: getCurrentDate(),
    };

    const PAYLOAD:Payload= {
      ...(
        mode === "create"
        ? {data : PayloadData}
        : {data : {}, id : 0}
      ), 
      mode
    }

    mutate.mutate(PAYLOAD,{
      onSuccess : (data: Invoice)=> {
        queryClient.invalidateQueries({queryKey : ["invoices", MODES[PayloadData.invoice_type.toUpperCase() as keyof typeof MODES]]});
        const m = mode === "create"
        ? `New invoice ${data.document_number} created successfully`
        : `Invoice ${data.document_number} updated successfully`
        toast.success(m)
        setOpen(false)
        
      },
      onError: (error)=> handleAxiosError(`Failed to ${mode  === "create" ? "create" : "update"} invoice`,error),
      onSettled: ()=> setLoading(false)
    })

  };


 
  return { 
    open,
    loading,
    formData,
    searchItem,
    rowsRef,
    setOpen,
    onSave,
    setFormData,
    setSearchItem,
    onSelectBiller,
  }
}