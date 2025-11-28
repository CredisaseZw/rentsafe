import ErrorResults from "@/components/general/ErrorResults"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import SingleCreditNote from "@/components/routes/rent-safe/accounting/sales/sales-invoice/CreditNote"
import useCreditNote from "@/hooks/components/useCreditNote"
import { MoveLeft } from "lucide-react"

function SalesCreditNote() {
  const {
    handleGoBack,
    isLoading,
    error,
    creditNote
  } = useCreditNote()
  return (
    <div>
      <div className="flex flex-row space-x-4 mt-3">
        <MoveLeft size={15} className="self-center cursor-pointer" onClick={handleGoBack}/>
        <span className="font-bold text-2xl">Credit Note</span>
      </div>

      <div className="main-sm-card mt-5">
        {isLoading && (
          <div className="w-full h-[25vh] flex justify-center items-center">
            <LoadingIndicator />
          </div>
        )}

        {!isLoading && error && <ErrorResults message="Failed to fetch Invoice" />}

        {!isLoading && creditNote && (
          <SingleCreditNote
            creditNote={creditNote}
            handleGoBack={handleGoBack}
          />
        )}
      </div>
    </div>
  )
}

export default SalesCreditNote