import Button from "@/components/general/Button";
import ButtonSpinner from "@/components/general/ButtonSpinner";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import EditIcon from "@/components/general/EditIcon";
import LoadingIndicator from "@/components/general/LoadingIndicator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import { Select, SelectItem,SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCY_OPTIONS } from "@/constants";
import useAddGeneralLedgerAccountDialogue from "@/hooks/apiHooks/useAddGeneralLedgerAccountDialogue";
import useCreateGeneralAccount from "@/hooks/apiHooks/useCreateGeneralAccount";
import type { GeneralLedgerAccount } from "@/types";
import { Plus, Send } from "lucide-react";

interface Props{
    initial? : GeneralLedgerAccount 
}
export default function AddGeneralLedgerAccountDialogue({initial}:Props){
    const {
        open,
        pagination,
        sectors,
        isLoading,
        loading,
        setOpen,
        handleSubmit,
        handleLoadMoreSectors,
    } = useAddGeneralLedgerAccountDialogue(initial);
    const createAccount = useCreateGeneralAccount();

    return (
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger>
                {
                    initial 
                    ? <EditIcon/>
                    : <Button asChild>Add Account <Plus size={15}/> </Button>
                }
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=>e.preventDefault()} className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle>{initial ? "Update" : "Create"} General Ledger Account</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-white/50">
                            {initial ? "Update" : "Add"} an account. {initial ? "MOdify" : "Fill"} out the details below and click submit when done.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <form id="add-account" className="space-y-5" onSubmit={(e)=> handleSubmit(e, createAccount)}>
                            <ColumnsContainer numberOfCols={2} gapClass="gap-5">
                                <div className="form-group">
                                    <Label className="required">Account Name</Label>
                                    <Input
                                        defaultValue={initial?.account_name ?? ""}
                                        name="accountName"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label className="required">Account Number</Label>
                                    <Input
                                        defaultValue={initial?.account_number ?? ""}
                                        name="accountNumber"
                                    />
                                </div>
                            </ColumnsContainer>
                            <div className="form-group">
                                <label className="required">Currency</label>
                                <Select 
                                    key={String(initial?.is_secondary_currency)}
                                    defaultValue={
                                        initial !== undefined &&
                                        initial?.is_secondary_currency 
                                        ? "secondary_currency"
                                        : "base_currency"
                                    }
                                    required
                                    name="currency"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder = "Select..."></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            CURRENCY_OPTIONS.map((c, idx)=>(
                                                <SelectItem value={c.value} key={idx}>{c.label}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                              </Select>
                            </div>
                            <div className="form-group">
                                <Label className="required">Account Sector</Label>
                                <Select  
                                    key={String(initial?.account_sector.id) ?? ""}
                                    required
                                    defaultValue={String(initial?.account_sector.id)} 
                                    name="accountSector"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select ..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            sectors.length === 0 && isLoading &&
                                            <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                                <LoadingIndicator />
                                            </SelectItem>   
                                        }
                                        {
                                            sectors.length !== 0 && 
                                            sectors.map((s, idx:number)=>(
                                                <SelectItem value={String(s.id)} key={idx}>{`${s.code} - ${s.name}`}</SelectItem>

                                            ))
                                        }
                                        {
                                            sectors.length === 0 && 
                                            !!isLoading && 
                                            <SelectItem disabled value="empty">Nothing to Show</SelectItem>
                                        }
                                        {
                                            sectors.length !== 0 && 
                                            pagination?.next &&
                                            <div className="flex justify-center p-2">
                                                <Button variant="ghost" onClick={handleLoadMoreSectors}>
                                                Load More
                                                </Button>
                                            </div>
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                    </div>
                    <DialogFooter>
                        <div className="flex flex-row justify-end gap-5">
                            <Button variant="ghost" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
                            <Button asChild form="add-account" disabled = {loading} type="submit">
                                {
                                    loading 
                                    ? <ButtonSpinner/>
                                    : <Send size={15}/>
                                }
                                Submit
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}