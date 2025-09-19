import ButtonSpinner from "@/components/general/ButtonSpinner"
import EmptyResults from "@/components/general/EmptyResults"
import Header from "@/components/general/Header"
import PaymentRow from "@/components/general/PaymentRow"
import { TableBase } from "@/components/general/TableBase"
import Button from "@/components/general/Button"
import { TableCell, TableRow } from "@/components/ui/table"
import { TENANT_STATEMENT_HEADERS } from "@/constants"
import useGetPaymentHistory from "@/hooks/apiHooks/useGetPaymentHistory"
import useTenantStatement from "@/hooks/components/useTenantStatement"
import { getCurrentDate, getSummaryDate, parseListString } from "@/lib/utils"
import type { PaymentHistory } from "@/types"
import { isAxiosError } from "axios"
import { Printer } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import ReceiptDialog from "@/components/routes/rent-safe/tenant-leases/ReceiptDialog"

function TenantStatement() {
    const {
        lease_id,
        payments,
        statement,
        paginationData,
        componentReference,
        setPaginationData,
        onDownloadPDF,
        setStatement,
        setPayments,
    } = useTenantStatement();
    const { data, isLoading, error, refetch } = useGetPaymentHistory(lease_id);

    useEffect(() => {
        if (isAxiosError(error)) {
            const message = error.response?.data.error ?? error.response?.data.detail ?? "Something went wrong"
            toast.error("Failed to fetch payments", { description: message })
        }

        if (data) {
            setPayments(data.results ?? [])
            setStatement({
                opening_balance_date: data.opening_balance_date,
                opening_balance: Number(data.opening_balance),
                primary_tenant: data.primary_tenant,
                address: data.address,
                total_invoiced: data.total_invoiced,
                current_balance: data.current_balance
            })
            setPaginationData({
                next: data.next ?? "",
                previous: data.previous ?? "",
                count: data.count
            });
        }
    }, [lease_id, data, error])

    return (
        <div>
            <Header title="Tenant Statement" />
            <div className="main-sm-card">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-0">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white" >{statement.primary_tenant ? parseListString(statement.primary_tenant) : <ButtonSpinner />}</h2>
                        <p className="m-0 text-sm text-gray-500 dark:text-white">{statement.address ?? "-"}</p>
                        <p className="m-0 text-sm text-gray-500 dark:text-white">{`Showing ${payments.length} of ${paginationData.count ?? 0} statements `}</p>

                    </div>
                    <div className="flex flex-col gap-0">
                        <h2 className="text-sm font-bold text-end text-gray-800 dark:text-white" >Date</h2>
                        <p className="text-gray-500 dark:text-white text-end"> {getCurrentDate()}</p>
                    </div>
                </div>
                <div className="mt-6" ref={componentReference}>
                    <TableBase
                        headers={TENANT_STATEMENT_HEADERS}
                        isLoading={isLoading}
                        paginationName="payments"
                        paginationData={paginationData}
                    >
                        {
                            !isLoading && payments.length > 0 && (
                                <TableRow>
                                    <TableCell className="text-center">{
                                        statement.opening_balance_date ?
                                            getSummaryDate(statement.opening_balance_date) :
                                            getSummaryDate(getCurrentDate())
                                    }
                                    </TableCell>
                                    <TableCell className="text-left">Opening Balance</TableCell>
                                    <TableCell className="text-center">Balance Brought Forward</TableCell>
                                    <TableCell colSpan={4} className="text-end">{"$" + statement.opening_balance}</TableCell>
                                </TableRow>
                            )
                        }
                        {!isLoading && payments.length > 0 && (
                            (() => {
                                let runningBalance = statement.opening_balance;

                                return payments.map((payment: PaymentHistory, index: number) => {
                                    runningBalance =
                                        payment.type === "Payment"
                                            ? runningBalance - Number(payment.amount)
                                            : runningBalance + Number(payment.amount);

                                    return (
                                        <PaymentRow
                                            key={index}
                                            payment={payment}
                                            balance={runningBalance}
                                        />
                                    );
                                });
                            })()
                        )}
                        {
                            !isLoading && payments.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={TENANT_STATEMENT_HEADERS.length}>
                                        <div className="flex flex-row gap-3 justify-end">
                                            {
                                                lease_id && statement.primary_tenant ?
                                                    <ReceiptDialog
                                                        onSuccessCallback={() => refetch()}
                                                        isButtonOutlined={true}
                                                        lease={{
                                                            lease_id: lease_id,
                                                            id: 0,
                                                            customerName: parseListString(statement.primary_tenant),
                                                            rentOwing: Number(statement.current_balance),
                                                            payment_date: getCurrentDate()
                                                        }}
                                                    /> :
                                                    <ButtonSpinner />
                                            }

                                            <Button variant={"success"} asChild size={"md"} onClick={() => onDownloadPDF()}>
                                                <Printer size={15} />
                                                Print
                                            </Button>
                                            <Button size={"md"}>Period Request</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {!isLoading && payments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={TENANT_STATEMENT_HEADERS.length}>
                                    <EmptyResults message="No payments made yet" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBase>
                </div>
            </div>
        </div>
    )
}

export default TenantStatement