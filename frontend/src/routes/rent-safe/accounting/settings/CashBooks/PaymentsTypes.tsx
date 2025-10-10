import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import AddPaymentTypeDialog from "@/components/routes/rent-safe/accounting/settings/AddPaymentTypeDialog"

function PaymentsTypes() {
  return (
    <div>
      <Header title="Payment Types"/>
      <div className="main-sm-card">
        <div className="flex flex-row justify-between">
          <SectionHeader
            title="Payment Types"
            subTitle="payment types"
            total={0}
            subTotal={0}
          />
          <AddPaymentTypeDialog/>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsTypes