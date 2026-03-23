import ErrorResults from "@/components/general/ErrorResults"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import TrustAccountSingleInvoice from "@/components/routes/rent-safe/trust-accounting/sales/invoicing/TrustAccountSingleInvoice"
import useTrustAccSingleInvoice from "@/hooks/components/useTrustAccSingleInvoice"
import { MoveLeft } from "lucide-react"

function TrustAccountingSalesSingleInvoice() {
    const {
        data,
        isError,
        isLoading,
        handleGoBack
    }  = useTrustAccSingleInvoice()
    return (
    <div>
        <div className="flex flex-row space-x-4 mt-3">
            <MoveLeft size={15} className="self-center cursor-pointer" onClick={handleGoBack}/>
            <span className="font-bold text-2xl">Invoices</span>
        </div>     
        <div className="main-sm-card mt-5">
            {isLoading && (
            <div className="w-full h-[25vh] flex justify-center items-center">
                <LoadingIndicator />
            </div>
            )}

        {!isLoading && isError && <ErrorResults message="Failed to fetch Invoice" />}

        {!isLoading && data && (
        <TrustAccountSingleInvoice
            invoice={data}
        />
        )}
      </div>
    </div>
  )
}

export default TrustAccountingSalesSingleInvoice