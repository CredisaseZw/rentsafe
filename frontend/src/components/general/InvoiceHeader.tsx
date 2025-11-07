import React from 'react'
import { Label } from "@/components/ui/label"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES, INVOICE_TYPES } from "@/constants"
import type{ Option } from "@/types"
import AutoCompleteClient from "@/components/general/AutoCompleteClient"
import { getCurrentDate } from "@/lib/utils"
import type { BranchFull, IndividualMinimal } from '@/interfaces'

interface props {
    formData: Record<string, any>,
    searchItem: string;
    setFormData: React.Dispatch<React.SetStateAction<{ biller_id: number; biller_name: string; biller_type: string; invoice_type : string}>>;
    setSearchItem: React.Dispatch<React.SetStateAction<string>>;
    onSelectBiller: (item: IndividualMinimal | BranchFull) => void;
    isRep?: boolean
    isType?: boolean
}
function InvoiceHeader({isRep, formData, searchItem, isType,setFormData, setSearchItem, onSelectBiller}: props) {
  return (
    <div className='w-full'>
        <ColumnsContainer numberOfCols={2} marginClass='mt-0' gapClass="gap-5">
            <div className="flex flex-col gap-5">
                <div className=" flex flex-row justify-between">
                    <Label className='text-gray-800 dark:text-white'>Bill To</Label>
                    <div className="flex flex-row gap-5">
                        <Select
                            value={formData.biller_type}
                            onValueChange={(val: "individual" | "company") => {
                                setSearchItem("")
                                setFormData((prev) => ({
                                    ...prev,
                                    iller_id: 0,
                                    biller_name: "",
                                    biller_type: val,
                                }));
                            }}
                        >
                            <SelectTrigger className="w-fit self-center">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    IN_LEASE_CLIENT_TYPES.map((option:Option, index : number)=>
                                        <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                        <AutoCompleteClient
                            displayValue='name'
                            isRequired = {false}
                            searchItem = {searchItem}
                            setSearchItem = {setSearchItem}
                            clientType = {formData.biller_type}
                            onSelectValue = {onSelectBiller}
                        />
                    </div> 
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Address</Label>
                    <Input
                        className="w-[400px]"
                        name="address"
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Phone</Label>
                    <Input
                        className="w-[400px]"
                        name="phone"
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Email</Label>
                    <Input
                        className="w-[400px]"
                        name="email"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">VAT No</Label>
                    <Input
                        className="w-[400px]"
                        name="vatNo"
                    />
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <Label className="text-gray-800 dark:text-white">Tin Number</Label>
                    <Input
                        className="w-[400px]"
                        name="tinNumber"
                    />
                </div>
                {
                    isRep &&
                    <div className="flex flex-row gap-5 justify-between">
                        <Label className="text-gray-800">Rep</Label>
                        <Input
                            className="w-[400px]"
                            name="rep"
                        />
                    </div>
                }
                {
                    isType &&
                    <div className="flex flex-row gap-5 justify-between">
                        <Label className="text-gray-800">Invoice Type</Label>                   
                        <Select   
                            value={formData.invoice_type}
                            required
                            name='invoiceType'
                            onValueChange={(v)=>{
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
                        <span className='text-sm'>{getCurrentDate()}</span>
                    </div>
                </div>
            </div>
        </ColumnsContainer>
        
    </div>
  
  )
}

export default InvoiceHeader