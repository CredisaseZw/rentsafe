import React from 'react'
import { Label } from "@/components/ui/label"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES } from "@/constants"
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
 
}
function InvoiceHeader({formData, searchItem, setFormData, setSearchItem, onSelectBiller}: props) {
  return (
    <ColumnsContainer numberOfCols={2} gapClass="gap-5">
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <Label className="">Document Number</Label>
                    <Input
                        className="w-[400px]"
                        name="documentNumber"
                    />
            </div>
            <div className=" flex flex-row justify-between">
                <Label>Bill To</Label>
                <div className="flex flex-row gap-5">
                    <Select
                        onValueChange={(val: "individual" | "company") => {
                        setSearchItem("")
                        setFormData((prev) => ({
                            ...prev,
                            biller_id: 0,
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
                <Label className="">Address</Label>
                <Input
                    className="w-[400px]"
                    name="address"
                />
            </div>
            <div className="flex flex-row gap-5 justify-between">
                <Label className="">Phone</Label>
                <Input
                    className="w-[400px]"
                    name="phone"
                />
            </div>
        </div>
        <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-5 justify-between">
                <Label className="">Email</Label>
                <Input
                    className="w-[400px]"
                    name="email"
                />
            </div>
            <div className="flex flex-row gap-5 justify-between">
                <Label className="">VAT No</Label>
                <Input
                    className="w-[400px]"
                    name="vatNo"
                />
            </div>
            <div className="flex flex-row gap-5 justify-between">
                <Label className="">Tin Number</Label>
                <Input
                    className="w-[400px]"
                    name="tinNumber"
                />
            </div>
            <div className="flex flex-row gap-5 justify-between">
                <Label className="">Date</Label>
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