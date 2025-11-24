import type { Biller, BranchFull, IndividualMinimal, InvoiceCustomerDetails } from "@/interfaces";
import { getCurrentDate, getSummaryDate } from "@/lib/utils";
import type { InvoicePreview } from "@/types";
import { useRef, useState } from "react";

export default function useSalesCashSales(){
    const [searchItem, setSearchItem] = useState("");
    const rowsRef = useRef<{getRows: () => InvoicePreview[]}>(null)
    
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
        invoice_type : "fiscal",
        description: "",
        issue_date : getSummaryDate(getCurrentDate())
    })

    const onSelectBiller = (item: any )=>{
        const itemCopy: BranchFull | IndividualMinimal | InvoiceCustomerDetails = item

        if ("first_name" in itemCopy) {
            setFormData((prev) => ({
            ...prev,
            biller_id: itemCopy.id,
            biller_name: `${itemCopy.first_name} ${itemCopy.last_name}`,
            }));
            return;
        }
        if ("branch_name" in itemCopy){
            setFormData((prev) => ({
                ...prev,
                biller_id: itemCopy.company.id,
                biller_name: itemCopy.company.registration_name,
            }));
        }
       
        return
    }
    const handleOnChangeFormData = (key:string, val: string)=>{
        setFormData((prev)=>({
        ...prev,
        [key] :  val
        }))
    }


    return{
        searchItem,
        formData,
        rowsRef,
        setFormData,
        onSelectBiller,
        setSearchItem,
        handleOnChangeFormData
    }

}