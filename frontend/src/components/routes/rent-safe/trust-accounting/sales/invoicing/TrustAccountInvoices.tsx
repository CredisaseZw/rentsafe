import { TableBase } from "@/components/general/TableBase"
import TrustAccountBillTableHeader from "./TrustAccountBillTableHeader"
import { TRUST_ACCOUNT_INVOICE_LIST_HEADERS } from "@/constants"
import type { TrustAccInvoicesTabProps } from "@/interfaces"
import { TableCell, TableRow } from "@/components/ui/table"
import { friendlyDate} from "@/lib/utils"
import Pill from "@/components/general/Pill"
import OptionsWrapper from "@/components/general/OptionsWrapper"
import MutateInvoiceStatus from "../../../accounting/sales/sales-invoice/MutateInvoiceStatus"
import { Link } from "react-router-dom"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"

function TrustAccountInvoices({
  mode,
  isError,
  isLoading,
  pagination,
  invoices
}: TrustAccInvoicesTabProps) {
  return (
    <div>
        <TrustAccountBillTableHeader
          title="Invoices"
          total={pagination?.count ?? 0}
          subTotal={invoices.length}
        />
        <div className="mt-5">
          <TableBase 
            isEmpty = {invoices.length === 0}
            isError = {isError}
            isLoading = {isLoading}
            paginationData={pagination}
            headers={TRUST_ACCOUNT_INVOICE_LIST_HEADERS}>
              {
                invoices.map((i)=>{
                  const VARIANT = i.status_display === "Pending"
                  ? "warning" : i.status_display === "Approved"
                  ? "success" : i.status_display === "Partially Paid"
                  ? "primary" : (i.status_display === "Overdue" || i.status_display === "Written Off")
                  ? "danger"  : "outline";

                  return(
                    <TableRow key={i.id}>
                      <TableCell className="text-center">{i.invoice_number}</TableCell>
                      <TableCell>{i.tenant_name}</TableCell>
                      <TableCell>{friendlyDate(i.invoice_date)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center">
                          <Pill variant={VARIANT}> {i.status_display} </Pill>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{i.currency_code}</TableCell>
                      <TableCell className="text-end">${i.subtotal}</TableCell>
                      <TableCell className="text-end">${i.tax_total}</TableCell>
                      <TableCell className="text-end">${i.total_amount}</TableCell>
                      <TableCell className="flex justify-center items-center">
                        {
                          i.status_display !== "Cancelled" &&
                          <OptionsWrapper>
                            <Link to = {`${RENTSAFE_PRE_SEG}/trust-accounting/sales/invoicing/${i.id}`}>
                              <div className="flex flex-row gap-5 cursor-pointer">
                                <span className="text-xs text-gray-700 dark:text-white">View More</span>
                              </div>
                            </Link>
                            { i.status_display === "Pending" ||
                              i.status_display === "Approved" &&
                              <MutateInvoiceStatus
                                mode={"MARK"}
                                defaultAmount = {Number(i.total_amount)}
                                invoiceMode={mode}
                                isTrustAcc = {true}
                                invoiceID={i.id}
                                documentNumber={i.document_number}
                              />
                            }
                            {
                              i.status_display === "Pending" ||
                              i.status_display === "Approved" &&
                              <MutateInvoiceStatus
                                mode={"POST_TO_LEDGER"}
                                invoiceMode={mode}
                                isTrustAcc = {true}
                                invoiceID={i.id}
                                documentNumber={i.document_number}
                              />  
                            }
                            {
                              mode === "proforma" &&
                              (
                                i.status_display === "Pending" ||
                                i.status_display === "Approved"
                              ) &&
                              <MutateInvoiceStatus
                                mode={"CONVERT"}
                                invoiceMode={mode}
                                isTrustAcc = {true}
                                invoiceID={i.id}
                                documentNumber={i.document_number}
                              />  
                            }
                            <MutateInvoiceStatus
                              mode={"CANCEL"}
                              invoiceMode={mode}
                              isTrustAcc = {true}
                              invoiceID={i.id}
                              documentNumber={i.document_number}
                            />
                          </OptionsWrapper>
                        }
                      </TableCell>
                    </TableRow>
                )})
              }
          </TableBase>
        </div>
     
    </div>
  )
}

export default TrustAccountInvoices