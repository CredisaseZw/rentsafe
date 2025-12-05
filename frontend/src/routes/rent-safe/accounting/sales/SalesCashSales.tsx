import Header from "@/components/general/Header"
import BillingDocumentHeader from "@/components/general/BillingDocumentHeader"
import BillingDocumentTotalsTable from "@/components/general/BillingDocumentTotalsTable"
import Button from "@/components/general/Button"
import { Send } from "lucide-react"
import useBillingDocumentForm from "@/hooks/components/useBillingDocumentForm"
import useRequestBillerUpdate from "@/hooks/apiHooks/useRequestBillerUpdate"
import useCreateCashSale from "@/hooks/apiHooks/useCreateCashSale"
import ButtonSpinner from "@/components/general/ButtonSpinner"

function SalesCashSales() {
  const updateBiller = useRequestBillerUpdate()
  const createCashSale = useCreateCashSale()
  const{
    rowsRef,
    loading,
    formData,
    searchItem,
    newCashSale,
    openPrintCashSale,
    handleOnChangeFormData,
    setOpenPrintCashSale,
    onSelectBiller,
    setSearchItem,
    setFormData,
    onSave,
  } = useBillingDocumentForm({
    updateBiller : updateBiller,
    type : "cashSale",
    createCashSale : createCashSale
  })

  return (
    <div>
      <Header title = "Fiscal Tax Invoice"/>
      <div className="main-sm-card">
        <form onSubmit={(e)=> onSave(e)}>
          <BillingDocumentHeader
            handleOnChangeFormData={handleOnChangeFormData}
            searchItem={searchItem}
            formData={formData}
            setFormData={setFormData}
            setSearchItem={setSearchItem}
            onSelectBiller={onSelectBiller}    
            isRep
          />
          <div className="my-10 ">
            <BillingDocumentTotalsTable 
              ref={rowsRef}
              isCashSales = {true}
              cashSaleProps={{
                dialogueControl : {
                  open : openPrintCashSale,
                  setOpen : setOpenPrintCashSale
                },
                cashSale : newCashSale
              }}
            />
          </div>
          <div className="mt-5 flex justify-end w-full">
            <Button type="submit" asChild disabled={loading}>
              {
                loading 
                ? <ButtonSpinner />
                : <Send size={15}/>
              }
               Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SalesCashSales