import type { Biller,  CreditNote, InvoiceCustomerDetails } from "@/interfaces";
import { formatAddress, getCurrentDate, getSummaryDate, handleAxiosError, onClearFilter, validateBill } from "@/lib/utils";
import type { InvoicePreview, InvoiceTotals, Payload } from "@/types";
import type { Invoice } from "@/interfaces";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import useClient from "../general/useClient";
import { toast } from "sonner";
import {useTrackBiller} from "./useTrackBiller";
import { useSearchParams } from "react-router";
import { useUpdateBillerStore } from "@/store/updateBillerStore";

export default function useBillingDocumentForm(
  defaultInvoiceType : "proforma" | "fiscal" | "recurring" | undefined,
  createBillMutation : UseMutationResult<any, Error, Payload, unknown>,
  type? : "invoice" | "creditNote",
  updateBiller? : UseMutationResult<any, Error, Payload, unknown>,
){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const queryClient = useClient();
  const updateBillerPayload = useRef<any | null>(null);
  const billPayload = useRef<Payload | null>(null);
  const [updateOnce, setUpdateOnce] = useState(0);
  const {permission, openDialogue, closeDialogue, onSettle, clearPermission} = useUpdateBillerStore()
  const [billerCopy, setBillerCopy] = useState<any>(null);
  const rowsRef = useRef<{
    getRows: () => InvoicePreview[]
    getTotals : ()=> InvoiceTotals
  }>(null)

  const [formData, setFormData] = useState<Biller>({
    biller_id : 0,
    biller_name : "",
    biller_type: "tenant",
    biller_phone : "",
    biller_email : "",
    biller_address : "",
    biller_vat_no : "",
    biller_tin_number : "",
    selector_type : "tenant",
    description : "",
    invoice_type : defaultInvoiceType ?? "fiscal", 
    issue_date : getSummaryDate(getCurrentDate()),
  } as Biller)
  
  const onSelectBiller = (item: InvoiceCustomerDetails) => {
    const BILLER: Partial<Biller> = {
      biller_id: item.id,
      biller_name : item.full_name,
      biller_phone: item.phone ?? "",
      biller_email: item.email ?? "",
      biller_type : item.customer_type,
      biller_address: formatAddress(item.address),
      biller_vat_no: item.vat_number ?? "",
      biller_tin_number: item.tin_number ?? "",
    };

    setFormData((prev) => ({ ...prev, ...BILLER }));
    setBillerCopy(BILLER);
  };
  const handleOnChangeFormData = (key:string, val: string)=>{
    setFormData((prev)=>({
      ...prev,
      [key] :  val
    }))
  }

  const createBill = () =>{
    setLoading(true)
    createBillMutation.mutate(billPayload.current!,{
        onSuccess : (data: Invoice | CreditNote)=> {
          onClearFilter?.(setSearchParams);
          const key = type === "invoice"
          ? ["invoices",`${defaultInvoiceType ?? "fiscal"}_invoices`, page, `?invoice_type__in=${defaultInvoiceType ?? "fiscal"}&page=${page}`]
          : ["creditNotes", page,`?page=${page}`]
          queryClient.invalidateQueries({queryKey : key})
          const m =  `New ${type} ${data.document_number} created successfully`
          toast.success(m)
          billPayload.current = null
          setOpen(false)

        },
        onError: (error)=> handleAxiosError(`Failed to create ${type}`,error),
        onSettled: ()=> setLoading(false)
      }) 
  }

  useEffect(()=>{
    if (!billPayload.current) return;
    if(permission === "allow" && updateBillerPayload.current){
      if(updateOnce === 0){
        updateBiller?.mutate(updateBillerPayload.current!, {
            onSuccess : ()=>{
              toast.success("Biller updated Successfully")
              setUpdateOnce((p) => p + 1);
              setTimeout(()=>{
                closeDialogue();
                createBill();
                clearPermission()
              }, 1200)
            },
            onSettled : ()=>{
              onSettle();
            }
          })
      }
      else {
        createBill();
        clearPermission()
      }
    } 
    if ( permission === "deny"){
      createBill();
      clearPermission()
    } 
  }, [permission])

  const onSave = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {  
    e.preventDefault();
    const mode = "create"
    const rows = rowsRef.current ? rowsRef.current.getRows() : [];
    const totals = rowsRef.current?.getTotals();
    if(validateBill(rows, formData)) return;

    const ITEMS = rows.map((item) => ({ sales_item_id: Number(item.salesItem), quantity: Number(item.quantity), }));
    const PayloadData = {
      invoice_type: formData.invoice_type,
      is_individual: formData.biller_type === "individual",
      customer_id: formData.biller_id,
      currency_id: totals?.currency_id,
      discount: type === "invoice" 
      ? -Number(totals?.discount || 0) 
      : Number(totals?.discount || 0),
      items: ITEMS,
      ...(
        type === "creditNote"
        ? {
          description : formData.description,
          credit_date : getCurrentDate()
        } 
        :{
          sale_date: getCurrentDate(),
        }
      )
    };
 
    billPayload.current = {
      data : PayloadData,
      mode
    }
    const {biller_id, invoice_type, biller_type, selector_type, issue_date,...BILLER} = formData
    const { UPDATE } = useTrackBiller( billerCopy, BILLER, formData.biller_type);
    const isUpdate = Boolean(UPDATE && Object.keys(UPDATE).length > 0);
    
    if (isUpdate && updateOnce === 0){
      updateBillerPayload.current = {
          mode : formData.biller_type,
          id : Number(formData.biller_id),
          data : UPDATE
      }
      openDialogue();
      return;
    }

    createBill()
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