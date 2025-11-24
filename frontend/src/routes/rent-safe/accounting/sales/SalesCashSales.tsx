import Header from "@/components/general/Header"
import InvoiceHeader from "@/components/general/BillingDocumentHeader"
import InvoiceTotalsTable from "@/components/general/BillingDocumentTotalsTable"
import useSalesCashSales from "@/hooks/components/useSalesCashSales"

function SalesCashSales() {
  const{
    rowsRef,
    searchItem,
    formData,
    setFormData,
    onSelectBiller,
    setSearchItem,
    handleOnChangeFormData
  } = useSalesCashSales()

  return (
    <div>
      <Header title = "Fiscal Tax Invoice"/>
      <div className="main-sm-card">
        <InvoiceHeader
          handleOnChangeFormData={handleOnChangeFormData}
          searchItem={searchItem}
          formData={formData}
          setFormData={setFormData}
          setSearchItem={setSearchItem}
          onSelectBiller={onSelectBiller}    
          isRep
        />
        <div className="my-10 ">
          <InvoiceTotalsTable ref={rowsRef} isCashSales = {true}/>
        </div>
      </div>
    </div>
  )
}

export default SalesCashSales