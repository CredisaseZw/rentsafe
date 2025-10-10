import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import AddCashbookDialog from "@/components/routes/rent-safe/accounting/settings/AddCashbookDialog"

function Lists() {
  return (
    <div>
      <Header title="Cashbooks"/>
      <div className="main-sm-card">
        <div className="flex flex-row justify-between">
          <SectionHeader
            title="Cashbook List"
            subTitle="cashbook list"
            total={0}
            subTotal={0}/>

            <AddCashbookDialog/>
        </div>
      </div>
    </div>
  )
}

export default Lists