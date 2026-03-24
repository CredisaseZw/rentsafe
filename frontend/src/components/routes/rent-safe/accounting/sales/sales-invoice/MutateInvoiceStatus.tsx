import { Button } from "@/components/ui/button"
import {
AlertDialog,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { INVOICE_MUTATION_STATUSES } from "@/constants"
import useMutateInvoiceStatus from "@/hooks/components/useMutateInvoiceStatus"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface props {
    mode : string,
    isTrustAcc?: boolean
    invoiceID: number,
    invoiceMode : string
    defaultAmount?: number
    documentNumber : string,
    successCallBack?: () => void
}

function MutateInvoiceStatus({ 
    mode,
    invoiceID,
    invoiceMode,
    documentNumber,
    isTrustAcc,
    defaultAmount,
    successCallBack,
}: props) {
    const INFO = INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES]
    const {
        open,
        loading,
        mutationData,
        onHandleChange,
        handleMarkInvoice,
        setOpen,
    } = useMutateInvoiceStatus(
        invoiceID, 
        mode,
        invoiceMode,
        successCallBack,
        isTrustAcc,
        defaultAmount
    );

    return (
        <AlertDialog open = {open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="flex flex-row gap-5 cursor-pointer">
                    <span className="text-xs text-gray-700 dark:text-white">{INFO.btnText}</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-700 dark:text-white">{INFO.heading} - ({documentNumber})</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-white">{INFO.description}</AlertDialogDescription>
                </AlertDialogHeader>
                {
                    mode === "MARK" && 
                    isTrustAcc &&
                    <div className="form-group">
                        <Label>Amount</Label>
                        <Input
                            value={mutationData.amount}
                            onChange={e => onHandleChange("amount", e.target.value)}
                        />
                    </div>
                }
                {
                    mode === "CANCEL" && 
                    isTrustAcc &&
                    <div className="form-group">
                        <Label>Reason</Label>
                        <Textarea
                            value={mutationData.reason}
                            onChange={e => onHandleChange("reason", e.target.value)}
                        />
                    </div>
                }
                <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel disabled = {loading}>Cancel</AlertDialogCancel>
                    <Button disabled = {loading} onClick={()=> handleMarkInvoice()}>
                        {
                            loading 
                            ? <ButtonSpinner/>
                            : INFO.btnText
                        }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
)
}

export default MutateInvoiceStatus