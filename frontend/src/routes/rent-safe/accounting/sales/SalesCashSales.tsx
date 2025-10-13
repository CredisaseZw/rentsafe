import Header from "@/components/general/Header"
import InvoiceHeader from "@/components/general/InvoiceHeader"
import InvoiceTotalsTable from "@/components/general/InvoiceTotalsTable"
import useSalesCashSales from "@/hooks/components/useSalesCashSales"

function SalesCashSales() {
  const{
    rowsRef,
    searchItem,
    formData,
    setFormData,
    onSelectBiller,
    setSearchItem,
  } = useSalesCashSales()

  return (
    <div>
      <Header title = "Fiscal Tax Invoice"/>
      <div className="main-sm-card">
        <InvoiceHeader
          searchItem={searchItem}
          formData={formData}
          setFormData={setFormData}
          setSearchItem={setSearchItem}
          onSelectBiller={onSelectBiller}    
        />
        <div className="my-10 ">
          <InvoiceTotalsTable ref={rowsRef} isCashSales = {true}/>
        </div>
      </div>
    </div>
  )
}

export default SalesCashSales