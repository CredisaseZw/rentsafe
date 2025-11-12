import type { Biller, BranchFull, IndividualMinimal } from "@/interfaces";
import { formatAddress, getCurrentDate, handleAxiosError, validateInvoices } from "@/lib/utils";
import type { InvoicePreview, InvoiceTotals, Payload } from "@/types";
import type { Invoice } from "@/interfaces";
import type { UseMutationResult } from "@tanstack/react-query";
import { useRef, useState } from "react";
import useClient from "../general/useClient";
import { MODES } from "@/constants";
import { toast } from "sonner";
import {useTrackBiller} from "./useTrackBiller";

export default function useAddInvoiceForm(defaultInvoiceType : "proforma" | "fiscal" | "recurring" | undefined){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useClient();
  const [billerCopy, setBillerCopy] = useState<any>(null);
  const rowsRef = useRef<{
    getRows: () => InvoicePreview[]
    getTotals : ()=> InvoiceTotals
  }>(null)

  const [formData, setFormData] = useState<Biller>({
    biller_id : 0,
    biller_name : "",
    biller_type: "individual",
    biller_phone : "",
    biller_email : "",
    biller_address : "",
    biller_vat_no : "",
    biller_tin_number : "",
    invoice_type : defaultInvoiceType ?? "fiscal"
  })

  const onSelectBiller = (item: IndividualMinimal | BranchFull) => {
    const isIndividual = "first_name" in item;

    const BILLER = {
      biller_id: isIndividual ? item.id : item.company.id,
      biller_name: isIndividual
        ? `${item.first_name} ${item.last_name}`
        : item.company.registration_name,
      biller_phone: item.phone ?? "",
      biller_email: item.email ?? "",
      biller_address: isIndividual
        ? (item.primary_address ? formatAddress(item.primary_address) : "")
        : item.summary_address ?? "",
      biller_vat_no: item.account_data?.vat_number ?? "",
      biller_tin_number: item.account_data?.tin_number ?? "",
    };
    setBillerCopy(BILLER);
    setFormData((prev) => ({ ...prev, ...BILLER }));
  };

  const handleOnChangeFormData = (key:string, val: string)=>{
    setFormData((prev)=>({
      ...prev,
      [key] :  val
    }))
  }

  const onSave = (
    e: React.FormEvent<HTMLFormElement>,
    mutate : UseMutationResult<any, Error, Payload, unknown>,
    updateBiller? : UseMutationResult<any, Error, Payload, unknown>
  ) => {  
    e.preventDefault();
    const mode = "create";
    const rows = rowsRef.current ? rowsRef.current.getRows() : [];
    const totals = rowsRef.current?.getTotals();
    if(validateInvoices(rows, formData)) return;

    setLoading(true)
    const {biller_id, invoice_type, biller_type, ...BILLER} = formData
    const {UPDATE} = useTrackBiller( billerCopy, BILLER);

    if (UPDATE){
      const payload_ = {
        mode : formData.biller_type,
        id : Number(formData.biller_id),
        data : UPDATE
      }
      updateBiller?.mutate(payload_);
    }

     
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
    handleOnChangeFormData,
    onSelectBiller,
    setSearchItem,
    setFormData,
    searchItem,
    formData,
    rowsRef,
    loading,
    setOpen,
    onSave,
    open
  }
}