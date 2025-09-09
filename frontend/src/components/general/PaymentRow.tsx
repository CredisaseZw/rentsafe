import type { PaymentHistory } from "@/types"
import { TableCell, TableRow } from "../ui/table"

interface props{
    payment :  PaymentHistory
}
function PaymentRow({payment} : props) {
  return (
    <TableRow>
        <TableCell className="text-center">{payment.payment_date}</TableCell>
        <TableCell className="text-left">{payment.description  ?? "-"}</TableCell>
        <TableCell className="text-center">{payment.reference}</TableCell>
        <TableCell className="text-end">{payment.amount}</TableCell>
    </TableRow>
  )
}

export default PaymentRow