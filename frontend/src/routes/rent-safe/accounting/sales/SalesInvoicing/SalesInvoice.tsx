import Pill from "@/components/general/Pill"
import { INVOICE_STATUS_VARIANT } from "@/constants"
import useSalesInvoice from "@/hooks/components/useSalesInvoice"
import {  MoveLeft } from "lucide-react"

function SalesInvoice() {
    const {
        handleGoBack
    } = useSalesInvoice()
    return (
        <div>
            <div className="flex flex-row space-x-4 mt-3">
                <MoveLeft size={15} className="self-center" onClick={handleGoBack}/>
                <span className="font-bold text-2xl">Invoice</span>
            </div>
            <div className="main-sm-card mt-5">
                <div className="flex justify-between border-b border-color pb-4">
                    <span className="text-lg">Fiscal Invoice</span>
                    <span className="font-bold text-sm">ID#: INV-1002</span>
                </div>  
                <div className="flex flex-row justify-between mt-5">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs">To</span>
                        <span className="font-semibold">GIlbert Lopah</span>
                        <span className="text-sm">ID#: 47112888U88</span>
                        <span className="text-sm">Email: gilbert2klopah@gma.com</span>
                        <span className="text-sm">Phone: 0713450075</span>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-xs text-end">Issued On</span>
                        <span className="text-sm text-end">11 March, 2027</span>
                        <div className="flex justify-end">
                            <Pill variant={INVOICE_STATUS_VARIANT[/* i.status */ "paid" as keyof typeof INVOICE_STATUS_VARIANT]} >
                                {/*i.status.replace("_", " ")*/ "paid"}
                            </Pill>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesInvoice