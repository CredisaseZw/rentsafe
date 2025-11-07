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

interface props {
    mode : string,
    invoiceID: number,
    documentNumber : string
}

function MutateInvoiceStatus({ invoiceID, documentNumber, mode}: props) {
    const INFO = INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES]
    const {
        open,
        setOpen
    } = useMutateInvoiceStatus(invoiceID);

    return (
        <AlertDialog open = {open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="flex flex-row gap-5 cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-white">{INFO.btnText}</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-700 dark:text-white">{INFO.heading} - ({documentNumber})</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-white">{INFO.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button>{INFO.btnText}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
)
}

export default MutateInvoiceStatus