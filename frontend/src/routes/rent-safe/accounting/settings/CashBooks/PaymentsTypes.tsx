import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddPaymentTypeDialog from "@/components/routes/rent-safe/accounting/settings/payment-types/AddPaymentTypeDialog"
import { TableCell, TableRow } from "@/components/ui/table"
import { PAYMENT_METHODS_HEADERS } from "@/constants"
import usePaymentTypes from "@/hooks/components/usePaymentTypes"

function PaymentsTypes() {
  const {
    paymentMethods,
    isLoading,
    error
  } =usePaymentTypes()
  return (
    <div>
      <Header title="Payment Types"/>
      <div className="main-card">
        <div className="flex flex-row justify-between">
          <SectionHeader
            title="Payment Types"
            subTitle="payment types"
            total={paymentMethods.length}
            subTotal={paymentMethods.length}
          />
          <AddPaymentTypeDialog/>
        </div>
        <div className="mt-5">
          <TableBase 
            isLoading = {isLoading}
            isError = {Boolean(error)}
            headers={PAYMENT_METHODS_HEADERS}>
              {
                !isLoading &&
                paymentMethods.length === 0 &&
                <EmptyTableResponse colSpan={PAYMENT_METHODS_HEADERS.length}/>
              }
              {
                paymentMethods.map((method, idx)=>(
                  <TableRow key={idx} >
                    <TableCell className="text-center">{method.id}</TableCell>
                    <TableCell className="text-center">{method.payment_method_name.toUpperCase()}</TableCell>
                  </TableRow>
                ))
              }
            </TableBase>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsTypes