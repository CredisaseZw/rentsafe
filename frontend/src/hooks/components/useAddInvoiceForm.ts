import type { Biller, BranchFull, IndividualMinimal, InvoiceCustomerDetails } from "@/interfaces";
import { formatAddress, getCurrentDate, getSummaryDate, handleAxiosError, handleTrackChangedFields, onClearFilter, validateInvoices } from "@/lib/utils";
import type { InvoicePreview, InvoiceTotals, Payload } from "@/types";
import type { Invoice } from "@/interfaces";
import type { UseMutationResult } from "@tanstack/react-query";
import { useRef, useState } from "react";
import useClient from "../general/useClient";
import { toast } from "sonner";
import {useTrackBiller} from "./useTrackBiller";
import { useSearchParams } from "react-router";

export default function useAddInvoiceForm(defaultInvoiceType : "proforma" | "fiscal" | "recurring" | undefined, invoice?: Invoice){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const queryClient = useClient();
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
    invoice_type : defaultInvoiceType ?? "fiscal",
    issue_date : getSummaryDate(getCurrentDate())
  })

/* FOR INVOICE EDITING 
  useEffect(()=>{
    if(!invoice) return;
    const BILLER: Partial<Biller> = {
      biller_name : invoice.customer_details.full_name ?? "",
      biller_id : Number(invoice.customer_details.id),
      biller_email : invoice.customer_details.email ?? "",
      biller_phone : invoice.customer_details.phone ?? "",
      biller_type : invoice.customer_details.customer_type ?? "",
      biller_address : formatAddress(invoice.customer_details.address!),
      biller_tin_number : invoice.customer_details.tin_number ?? "",
      biller_vat_no : invoice.customer_details.vat_number ?? "",
      issue_date : getSummaryDate(invoice.date_created)
    }
    setFormData((p)=>({ ...p, ...BILLER }))
    const {biller_id, invoice_type, biller_type, issue_date, ...rest} = BILLER
    setBillerCopy(rest);
    setSearchItem(invoice.customer_details.full_name ?? "");
  }, [invoice])
 */

  const onSelectBiller = (item: IndividualMinimal | BranchFull | InvoiceCustomerDetails) => {
    const id = Number((item as any).id) || 0;
    const phone = (item as any).phone ?? "";
    const email = (item as any).email ?? "";

    let biller_name = "";
    let biller_type: Biller["biller_type"] = "tenant";
    let rawAddress: any = (item as any).primary_address ?? (item as any).address ?? null;
    const vat_no = (item as any).vat_number ?? (item as any).account_data?.vat_number ?? "";
    const tin_number = (item as any).tin_number ?? (item as any).account_data?.tin_number ?? "";

    if ("vat_number" in item) {
      biller_name = (item as InvoiceCustomerDetails).full_name ?? "";
      biller_type = ((item as InvoiceCustomerDetails).customer_type as Biller["biller_type"]) ?? biller_type;
      rawAddress = (item as InvoiceCustomerDetails).address ?? rawAddress;
    } else if ("first_name" in item) {
      const ind = item as IndividualMinimal;
      biller_name = `${ind.first_name} ${ind.last_name ?? ""}`.trim();
      biller_type = "individual";
      rawAddress = ind.primary_address ?? rawAddress;
    } else if ("branch_name" in item) {
      const br = item as BranchFull;
      biller_name = br.branch_name ?? "";
      biller_type = "company";
      rawAddress = br.summary_address ?? rawAddress;
    }

    const BILLER: Partial<Biller> = {
      biller_id: id,
      biller_name,
      biller_phone: phone,
      biller_email: email,
      biller_type,
      biller_address: formatAddress(rawAddress),
      biller_vat_no: vat_no,
      biller_tin_number: tin_number,
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

  const onSave = (
    e: React.FormEvent<HTMLFormElement>,
    mutate : UseMutationResult<any, Error, Payload, unknown>,
    updateBiller? : UseMutationResult<any, Error, Payload, unknown>
  ) => {  
    e.preventDefault();
    const mode = !invoice
    ? "create"
    : "update";
    const rows = rowsRef.current ? rowsRef.current.getRows() : [];
    const totals = rowsRef.current?.getTotals();
    if(validateInvoices(rows, formData)) return;

    setLoading(true)
    const {biller_id, invoice_type, biller_type, selector_type, issue_date,...BILLER} = formData
    const { UPDATE } = useTrackBiller( billerCopy, BILLER, formData.biller_type);
    
    if (UPDATE){
      const payload_ = {
        mode : formData.biller_type,
        id : Number(formData.biller_id),
        data : UPDATE
      }
      updateBiller?.mutate(payload_, {
        onSuccess : ()=>{
          queryClient.invalidateQueries({queryKey : ["invoice", Number(invoice?.id)]});
          toast.success("Biller information update successful.");
        }
      });
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

    if(mode === "update"){
      const invoicePayload = {
        invoice_type: invoice?.invoice_type,
        is_individual: invoice?.customer_details.customer_type === "individual",
        customer_id: invoice?.customer_details.id,
        currency_id: invoice?.currency.id,
        discount: -Number(invoice?.discount || 0),
        items: invoice?.line_items
          ? invoice.line_items.map((item) => ({
              sales_item_id: Number(item.sales_item.id),
              quantity: Number(item.quantity),
            }))
          : [],
      //  sale_date: new Date(invoice?.date_created ?? "").toISOString().split("T")[0]
      }
      const {sale_date, ...invoiceCopy} = PayloadData;
      const changes = handleTrackChangedFields(invoicePayload, invoiceCopy);
      if(!changes) {
        setLoading(false);
        return toast.info("No Invoice changes made")
      }
    }

    const PAYLOAD:Payload= {
      ...(
        mode === "update" &&
        { id : invoice?.id}
      ), 
      data : PayloadData,
      mode
    }
    mutate.mutate(PAYLOAD,{
      onSuccess : (data: Invoice)=> {
        onClearFilter?.(setSearchParams);
        queryClient.invalidateQueries({queryKey : ["invoices",`${defaultInvoiceType ?? "fiscal"}_invoices`, page, `?invoice_type__in=${defaultInvoiceType ?? "fiscal"}&page=${page}`]})
        if(mode === "update") queryClient.invalidateQueries({queryKey : ["invoice", Number(invoice?.id)]});
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