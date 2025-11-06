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
    setFormData: React.Dispatch<React.SetStateAction<{ biller_id: number; biller_name: string; biller_type: string; }>>;
    setSearchItem: React.Dispatch<React.SetStateAction<string>>;
    onSelectBiller: (item: IndividualMinimal | BranchFull) => void;
    isRep?: boolean
    isType?: boolean
}
function InvoiceHeader({isRep, formData, searchItem, isType,setFormData, setSearchItem, onSelectBiller}: props) {
  return (
    <ColumnsContainer numberOfCols={2} gapClass="gap-5">
        <div className="flex flex-col gap-5">
            <div className=" flex flex-row justify-between">
                <Label className='text-gray-800 dark:text-white'>Bill To</Label>
                <div className="flex flex-row gap-5">
                    <Select
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
                        isRequired = {false}
                        searchItem = {searchItem}
                        setSearchItem = {setSearchItem}
                        clientType = {formData.biller_type}
                        onSelectValue = {onSelectBiller}
                    />
                </div>
            </div>
          
            <div className="flex flex-row gap-5 justify-between">
                <Label className="text-gray-800 dark:text-white">Discount</Label>
                <Input
                    className="w-[400px]"
                    name="number"
                />
            </div>
        </div>
        <div className="flex flex-col gap-5">
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
                        defaultValue={INVOICE_TYPES[0].value}
                        required
                        name='invoiceType'
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
            <div className="flex flex-row gap-5 justify-between">
                <Label className="text-gray-800 dark:text-white">Date</Label>
                <Input
                    value={getCurrentDate()}
                    className="w-[400px]"
                    name="date"
                />
            </div>
        </div>
    </ColumnsContainer>
  )
}

export default InvoiceHeader