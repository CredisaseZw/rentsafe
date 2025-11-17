import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ColumnsContainer from "../general/ColumnsContainer"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import useAddCashbookForm from "@/hooks/components/useAddCashbookForm"
import LoadingIndicator from "../general/LoadingIndicator"
import { ACCOUNT_TYPES } from "@/constants"
import Button from "../general/Button"
import type { Cashbook } from "@/types"
import useCreateCashbook from "@/hooks/apiHooks/useCreateCashbook"
import ButtonSpinner from "../general/ButtonSpinner"
import { Send } from "lucide-react"

interface props {
    successCallback? : ()=>void;
    initial? :Cashbook
}

function AddCashbookForm({initial, successCallback}:props) {
    const {
        generalLedgerAccounts,
        generalLedgersLoading,
        currencies,
        currency,
        loading,
        currencyLoading,
        handleSubmit,
    } = useAddCashbookForm(initial, successCallback)
    const createCashBook = useCreateCashbook()
    return (
        <form className="flex gap-5 flex-col" onSubmit={(e)=>handleSubmit(e, createCashBook)} >
            <ColumnsContainer numberOfCols={2} gapClass="gap-5">
                <div className="form-group">
                    <Label className="required">Cashbook Name</Label>
                    <Input 
                        defaultValue={initial?.cashbook_name}
                        name="cashbookName"
                        type="text"
                        required
                    />
                </div>
                <div className="form-group">
                    <Label className="required">Currency</Label>
                    <Select
                        key={currency?.id}
                        name="currency"
                        required
                        defaultValue={String(initial?.currency.id || currency?.id)}>
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
            </ColumnsContainer>
            <div className="form-group">
                <Label className="required">Account Type</Label>
                <Select
                    required
                    defaultValue={initial?.account_type}
                    name="accountType"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            ACCOUNT_TYPES.map((a, idx)=>
                                <SelectItem value={String(a.value)} key={idx} > {a.label}</SelectItem>   
                            )
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label className="required">Bank Account Number</Label>
                <Input 
                    defaultValue={initial?.bank_account_number}
                    required
                    name="bankAccountNumber"
                    type="text"
                />
            </div>
            <div className="form-group">
                <Label className="required">Branch Name</Label>
                <Input 
                    defaultValue={initial?.branch_name}
                    required
                    name="branch"
                    type="text"
                />
            </div>
            <div className="form-group">
                <Label className="required">General Ledger Account</Label>
                <Select
                    defaultValue={String(initial?.general_ledger_account.id)}
                    required
                    name="generalLedgerAccount"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            generalLedgerAccounts.length === 0 && generalLedgersLoading &&
                            <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                <LoadingIndicator />
                            </SelectItem>   
                        }
                        {
                            generalLedgerAccounts.length !== 0 && 
                            generalLedgerAccounts.map((s, idx:number)=>(
                                <SelectItem value={String(s.id)} key={idx}>{s.account_number} - { s.account_name}</SelectItem>
                            ))
                        }
                        {
                            generalLedgerAccounts.length === 0 && 
                            !!generalLedgersLoading && 
                            <SelectItem disabled value="empty">Nothing to Show</SelectItem>
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-row gap-10">
                <Label className="self-center">Active Requisition</Label>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-3">
                        <Input
                        type="radio"
                        name="activeRequisition"
                        value="true"
                        defaultChecked={initial?.requisition_status === true}
                        />
                        <Label>Yes</Label>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Input
                        type="radio"
                        name="activeRequisition"
                        value="false"
                        defaultChecked={
                        initial?.requisition_status === false || initial?.requisition_status === undefined
                        }
                        />
                        <Label>No</Label>
                    </div>

                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled = {loading} asChild>
                        {
                            loading 
                            ? <ButtonSpinner />
                            : <Send size={15}/>
                        }
                        Submit
                </Button>
            </div>
        </form>
    )
}

export default AddCashbookForm