import ErrorResults from "@/components/general/ErrorResults"
import SingleInvoice from "@/components/general/SingleInvoice"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import useSalesInvoice from "@/hooks/components/useSalesInvoice"
import { MoveLeft } from "lucide-react"

function SalesInvoice() {
  const { invoice, isLoading, error, handleGoBack, markStatus } = useSalesInvoice()

  return (
    <div>
      <div className="flex flex-row space-x-4 mt-3">
        <MoveLeft size={15} className="self-center cursor-pointer" onClick={handleGoBack}/>
        <span className="font-bold text-2xl">Invoice</span>
      </div>

      <div className="main-sm-card mt-5">
        {isLoading && (
          <div className="w-full h-[25vh] flex justify-center items-center">
            <LoadingIndicator />
          </div>
        )}

        {!isLoading && error && <ErrorResults message="Failed to fetch Invoice" />}

        {!isLoading && invoice && (
          <SingleInvoice
            invoice={invoice}
            markInvoice={markStatus}
            handleGoBack={handleGoBack}
          />
        )}
      </div>
    </div>
  )
}

export default SalesInvoice
