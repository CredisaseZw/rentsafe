import type { Biller,  CashSale, CreditNote, InvoiceCustomerDetails } from "@/interfaces";
import { formatAddress, getCurrentDate, getSummaryDate, handleAxiosError, onClearFilter, validateBill, validateCashSale } from "@/lib/utils";
import type { CashSalesRow, InvoicePreview, InvoiceTotals, Payload } from "@/types";
import type { Invoice } from "@/interfaces";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import useClient from "../general/useClient";
import { toast } from "sonner";
import {useTrackBiller} from "./useTrackBiller";
import { useSearchParams } from "react-router";
import { useUpdateBillerStore } from "@/store/updateBillerStore";

interface props{
  defaultInvoiceType? : "proforma" | "fiscal" | "recurring" | undefined,
  createBillMutation? : UseMutationResult<any, Error, Payload, unknown>,
  updateBiller? : UseMutationResult<any, Error, Payload, unknown>,
  createCashSale? : UseMutationResult<any, Error, Payload, unknown>,
  type? : "invoice" | "creditNote" | "cashSale",
}

export default function useBillingDocumentForm({
  defaultInvoiceType,
  createBillMutation,
  createCashSale,
  updateBiller,
  type
}:props){
  const [open, setOpen] = useState(false);
  const [openPrintCashSale, setOpenPrintCashSale] = useState(false)
  const [newCashSale, setNewCashSale] = useState<CashSale>({} as CashSale);
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
    getCashSale : () => CashSalesRow
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

  const onCreateCashSale = () => {
    createCashSale?.mutate(billPayload.current!, {
      onSuccess: (data: CashSale) =>{
        setNewCashSale(data)
        toast.success(`Cash sale ${data.document_number} successfully created.`);
        setOpenPrintCashSale(true);
      },
      onError : (error) => handleAxiosError("Failed to create cash sale", error),
      onSettled : ()=> setLoading(false)
    })
  }

  const createBill = () =>{
    setLoading(true)
    createBillMutation?.mutate(billPayload.current!,{
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

  const onMutation = () =>{
    if(type === "cashSale"){
      onCreateCashSale()
    } else {
      createBill()
    } 
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
                onMutation();
                clearPermission()
              }, 1200)
            },
            onSettled : ()=>{
              onSettle();
            }
          })
      }
      else {
        onMutation();
        clearPermission()
      }
    } 
    if ( permission === "deny"){
      onMutation();
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
    const cashSale = rowsRef.current?.getCashSale();
    let cashSalePayload;
    if(validateBill(rows, formData)) return;
    if(type === "cashSale"){
      if(validateCashSale(cashSale)) return;
    }

    const ITEMS = rows.map((item) => ({ sales_item_id: Number(item.salesItem), quantity: Number(item.quantity), }));
    
    if(type === "cashSale"){
      cashSalePayload = {
        payment_type_id: Number(cashSale?.paymentType),
        cashbook_id: Number(cashSale?.cashBook), 
        details: String(cashSale?.detail),
        reference: String(cashSale?.ref),
        ...(
          cashSale?.amountReceived &&
          cashSale.amountReceived.toString().trim().length > 0 &&
          {
            amount_received: parseFloat(cashSale.amountReceived)
          }
        )
      }
    }

    const extraPayload = type === "creditNote"
      ? {
          invoice_type: formData.invoice_type,
          description: formData.description,
          credit_date: getCurrentDate(),
        }
      : type === "invoice"
      ? {
          invoice_type: formData.invoice_type,
          sale_date: getCurrentDate(),
        }
      : type === "cashSale"
      ? cashSalePayload
      : null;

    const PayloadData = {
      is_individual: formData.biller_type === "individual",
      customer_id: formData.biller_id,
      currency_id: totals?.currency_id,
      discount: type === "invoice"
        ? -Number(totals?.discount || 0)
        : Number(totals?.discount || 0),
      items: ITEMS,
      ...extraPayload
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

    onMutation();
  };
 
  return { 
    handleOnChangeFormData,
    setOpenPrintCashSale,
    openPrintCashSale, 
    onSelectBiller,
    setSearchItem,
    setFormData,
    newCashSale,
    searchItem,
    formData,
    rowsRef,
    loading,
    setOpen,
    onSave,
    open
  }
}