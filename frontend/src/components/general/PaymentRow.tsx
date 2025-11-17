// PaymentRow.tsx
import type { PaymentHistory } from "@/types";
import { TableCell, TableRow } from "../ui/table";
import { getSummaryDate } from "@/lib/utils";

interface Props {
  payment: PaymentHistory;
  balance: number;
}

function PaymentRow({ payment, balance }: Props) {
  return (
    <TableRow>
      <TableCell className="text-center">
        {getSummaryDate(payment.payment_date)}
      </TableCell>
      <TableCell className="text-left">
        {payment.description ?? "-"}
      </TableCell>
      <TableCell className="text-center">{payment.reference}</TableCell>
      <TableCell className="text-center">{payment?.cashbook_name ?? "-"}</TableCell>
      <TableCell className="text-end">
        {
          payment.type === "Payment" ?
          `(${payment.method}${payment.amount})` : 
          `${payment.method}${payment.amount}`
        }
        </TableCell>
      <TableCell className="text-end">{"$" + balance}</TableCell>
    </TableRow>
  );
}

export default PaymentRow;
