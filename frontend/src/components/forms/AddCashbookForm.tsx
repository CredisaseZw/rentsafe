import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies"
import ColumnsContainer from "../general/ColumnsContainer"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useEffect } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import useAddCashbookForm from "@/hooks/components/useAddCashbookForm"
import LoadingIndicator from "../general/LoadingIndicator"
import { ACCOUNT_TYPES } from "@/constants"
import Button from "../general/Button"

function AddCashbookForm() {
    const {
        currencies,
        defaultCurrency,
        setDefaultCurrency,
        setCurrencies
    } = useAddCashbookForm()

    const {currencyData, currencyLoading, currencyError} = useGetCurrencies()

    useEffect(()=>{
        if(isAxiosError(currencyError)){
            const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
            toast.error("Error fetching currencies", {description : m})
        } 
        if(currencyData){
            const id = currencyData.find((c)=> c.currency_code === "USD")?.id
            setCurrencies(currencyData)
            setDefaultCurrency(String(id))
        }
    },[currencyData, currencyError])

    return (
        <form className="flex gap-5 flex-col">
            <ColumnsContainer numberOfCols={2} gapClass="gap-5">
                <div className="form-group">
                    <Label className="required">Cashbook ID</Label>
                    <Input 
                        name="cashbookID"
                        type="text"
                        required
                    />
                </div>
                <div className="form-group">
                    <Label className="required">Cashbook Name</Label>
                    <Input 
                        name="cashbookName"
                        type="text"
                        required
                    />
                </div>
            </ColumnsContainer>
            <div className="form-group">
                <Label>Currency</Label>
                <Select
                    key={defaultCurrency}
                    name="current"
                    required
                    defaultValue={defaultCurrency}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            currencies.map((c)=>
                            <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>)
                        }
                        { 
                            currencies.length === 0 &&
                            currencyLoading &&
                           <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                <LoadingIndicator />
                            </SelectItem>
                        }
                    </SelectContent>
                </Select>  
            </div>
            <ColumnsContainer numberOfCols={2} gapClass="gap-5">
                <Label className="self-center">Active Requisition</Label>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-3">
                        <Input type={"radio"}  name="activeRequisition"/>
                        <Label>Yes</Label>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Input type={"radio"} defaultChecked name="activeRequisition"/>
                        <Label>No</Label>
                    </div>
                </div>
            </ColumnsContainer>
            <div className="form-group">
                <Label>Account Type</Label>
                <Select
                    name="accountType"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            ACCOUNT_TYPES.map((a, idx)=>
                                <SelectItem value={String(a.value)} key={idx} >{a.label}</SelectItem>   
                            )
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label>Bank Account Number</Label>
                <Input 
                    name="bankAccountNumber"
                    type="text"
                />
            </div>
            <div className="form-group">
                <Label>Cashbook ID</Label>
                <Input 
                    name="branch"
                    type="text"
                />
            </div>
            <div className="form-group">
                <Label className="required">General Ledger Account</Label>
                <Select
                    required
                    name="generalLedgerAccount"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end">
                <Button>Submit</Button>
            </div>
        </form>
    )
}

export default AddCashbookForm