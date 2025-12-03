import React, { useEffect } from 'react'
import { Label } from "@/components/ui/label"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES, INVOICE_TYPES } from "@/constants"
import type{ Option } from "@/types"
import AutoCompleteClient from "@/components/general/AutoCompleteClient"
import type { Biller, InvoiceCustomerDetails } from '@/interfaces'
import UpdateBillerConfirmationDialogue from '@/components/routes/rent-safe/accounting/sales/sales-invoice/UpdateBillerConfirmationDialogue'
interface props {
    formData: Biller,
    searchItem: string;
    isRep?: boolean;
    isType?: boolean;
    isDescription?:boolean;
    setFormData: React.Dispatch<React.SetStateAction<Biller>>;
    setSearchItem: React.Dispatch<React.SetStateAction<string>>;
    onSelectBiller: (item: InvoiceCustomerDetails) => void;
    handleOnChangeFormData : (key:string, val: string) => void
}

function BillingDocumentHeader({
    isRep,
    formData,
    searchItem,
    isType,
    isDescription,
    setFormData,
    setSearchItem,
    onSelectBiller,
    handleOnChangeFormData}: props) {
    useEffect(()=>{
        setSearchItem("")
        setFormData((p)=>({
            ...p,
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
        }))
    }, [])
  return (
    <div className='w-full'>
        <ColumnsContainer numberOfCols={2} marginClass='mt-0' gapClass="gap-5">
            <div className="flex flex-col gap-5">
                <div className=" flex flex-row justify-between">
                    <Label className='text-gray-800 dark:text-white'>Bill To</Label>
                    <div className="flex flex-row gap-5">
                        <Select
                            value={formData.selector_type}
                            onValueChange={(val: "individual" | "company" | "tenant") => {
                                setSearchItem("")
                                setFormData((prev) => ({
                                    ...prev,
                                    biller_id: 0,
                                    biller_name: "",
                                    biller_phone : "",
                                    biller_email : "",
                                    biller_address : "",
                                    biller_vat_no : "",
                                    biller_tin_number : "",
                                    biller_type: val,
                                    selector_type : val

                                }));
                            }}
                        >
                            <SelectTrigger className="w-fit self-center">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"tenant"}>Tenant</SelectItem>
                                {
                                    IN_LEASE_CLIENT_TYPES.map((option:Option, index : number)=>
                                        <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                        <AutoCompleteClient
                            clientType = {formData.selector_type}
                            onSelectValue = {onSelectBiller}
                            setSearchItem = {setSearchItem}
                            placeHolder='e.g John Doe'
                            searchItem = {searchItem}
                            isRequired = {false}
                            displayValue='name'
                            sector="customer"                        
                            createClient
                        />
                    </div> 
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Address</Label>
                    <Input
                        onChange={(e)=> handleOnChangeFormData("biller_address", e.target.value)}
                        value={formData.biller_address}
                        className="w-[400px]"
                        name="address"
                        readOnly
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Phone</Label>
                    <Input
                        onChange={(e)=> handleOnChangeFormData("biller_phone", e.target.value)}
                        value={formData.biller_phone}
                        className="w-[400px]"
                        name="phone"
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Email</Label>
                    <Input
                        onChange={(e)=> handleOnChangeFormData("biller_email", e.target.value)}
                        value={formData.biller_email}
                        className="w-[400px]"
                        name="email"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">VAT No</Label>
                    <Input
                        onChange={(e)=> handleOnChangeFormData("biller_vat_no", e.target.value)}
                        value={formData.biller_vat_no}
                        className="w-[400px]"
                        name="vatNo"
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Tin Number</Label>
                    <Input
                        onChange={(e)=> handleOnChangeFormData("biller_tin_number", e.target.value)}
                        value={formData.biller_tin_number}
                        className="w-[400px]"
                        name="tinNumber"
                    />
                </div>
                { isDescription &&
                    <div className="flex flex-row gap-5 justify-between">
                        <Label className="text-gray-800 dark:text-white">Description</Label>
                        <Input
                            onChange={(e)=> handleOnChangeFormData("description", e.target.value)}
                            value={formData.description}
                            className="w-[400px]"
                            name="rep"
                        />
                    </div>
                }
                {
                    isRep &&
                    <div className="flex flex-row gap-5 justify-between">
                        <Label className="text-gray-800 dark:text-white">Rep</Label>
                        <Input
                            onChange={(e)=> handleOnChangeFormData("rep", e.target.value)}
                            value={formData.rep}
                            className="w-[400px]"
                            name="rep"
                        />
                    </div>
                }
                {
                    isType &&
                    <div className="flex flex-row gap-5 justify-between">
                        <Label className="text-gray-800 dark:text-white">Invoice Type</Label>                   
                        <Select   
                            value={formData.invoice_type}
                            required
                            name='invoiceType'
                            onValueChange={(v:"fiscal" | "proforma" | "recurring")=>{
                                setFormData(p=>({
                                    ...p,
                                    invoice_type : v
                                }))
                            }}
                        >
                            <SelectTrigger className='w-[400px]'>
                                <SelectValue placeholder= "Select ..."></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {INVOICE_TYPES.map((i, idx)=>(
                                    <SelectItem key={idx} value={i.value}>{i.label}</SelectItem>
                                ))}                       
                            </SelectContent>
                        </Select>
                    </div>
                }
                <div className='flex justify-end'>
                    <div className="flex flex-row w-fit gap-5 justify-end mt-5">
                        <Label className="text-gray-800 dark:text-white">Date:</Label> 
                        <span className='text-sm'>{formData.issue_date}</span>
                    </div>
                </div>
            </div>
        </ColumnsContainer>
        <UpdateBillerConfirmationDialogue/>
    </div>
  
  )
}

export default BillingDocumentHeader