import type { BranchFull, IndividualMinimal } from "@/interfaces";
import type { Currency, InvoicePreview } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function useAddInvoiceForm(){
  const [searchItem, setSearchItem] = useState("");
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [currency, setCurrency] = useState<Currency>()
  const [discount, setDiscount] = useState(0.00)
  const [rows, setRows] = useState<InvoicePreview[]>([{} as InvoicePreview])
  const [formData, setFormData] = useState({
      biller_id : Number(""),
      biller_name : "",
      biller_type: "",
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

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value > 0) {
      toast.info("Discount should be input as a negative value");
    }

    setDiscount(value);
  };

  const AddInvoiceRow = () => setRows((prev) => [...prev, {} as InvoicePreview]);
  const RemoveInvoiceRow = (index: number) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };
  
  return { 
    currency,
    formData,
    searchItem,
    currencies,
    discount,
    rows,
    setFormData,
    setSearchItem,
    onSelectBiller,
    setCurrency,
    setCurrencies,
    handleDiscountChange,
    AddInvoiceRow,
    RemoveInvoiceRow
  }
}