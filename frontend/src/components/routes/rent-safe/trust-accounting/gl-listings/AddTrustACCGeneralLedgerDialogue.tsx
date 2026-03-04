import AutoCompleteAccountSectors from "@/components/general/AutoCompleteTrustAccountSectors"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import EditIcon from "@/components/general/EditIcon"
import SwitchContainer from "@/components/general/SwitchContainer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAddTrustACCGeneralLedgerDialogue from "@/hooks/components/useAddTrustACCGeneralLedgerDialogue"
import type { TrustGLAccount } from "@/interfaces"
import { DollarSign, Plus, Send } from "lucide-react"

interface props{
    tsaGeneralLedger? : TrustGLAccount
}
function AddTrustACCGeneralLedgerDialogue({tsaGeneralLedger} : props) {
    const {
        onSelectAccount,
        setIsContra,
        onSubmit,
        setOpen,
        isContra,
        loading,
        open
    } = useAddTrustACCGeneralLedgerDialogue(tsaGeneralLedger)
    return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
            {
                tsaGeneralLedger?
                <div className="flex flex-row gap-3">
                    <EditIcon />
                    <span className="text-sm">Edit</span>
                </div>
                : <Button>Add General Ledger <Plus/></Button>
            }
        </DialogTrigger>
        <DialogContent className="md:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>
                    Add General Ledger
                </DialogTitle>
                <DialogDescription>Add a general Ledger. Fill out the details below and click submit when done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e)=> onSubmit(e)} id = "add-trust-general-acc" className="flex flex-col gap-4"> 
                <div className="form-group">
                    <Label className="required">Account Name </Label>
                    <Input 
                        required
                        name="account_name"
                        defaultValue={tsaGeneralLedger?.account_name}
                        placeholder="e.g rentals"
                    />
                </div>
                <AutoCompleteAccountSectors
                    defaultValue={tsaGeneralLedger?.account_type.name ?? ""}
                    onSelectAccount={onSelectAccount}
                />

                <SwitchContainer
                    check = {isContra}
                    onCheck={setIsContra}
                    name="isContra"
                    label="Is Contra Account"
                    subLabel="Is the account in primary or secondary currency"
                    Icon={DollarSign}
                />
                
            </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button form="add-trust-general-acc">
                    {
                        loading
                        ?<ButtonSpinner/>
                        : <Send/>
                    }
                    Submit
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddTrustACCGeneralLedgerDialogue