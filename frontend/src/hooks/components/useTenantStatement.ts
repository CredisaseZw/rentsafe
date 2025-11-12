import type { PaginationData } from "@/interfaces";
import { handleAxiosError, parseListString } from "@/lib/utils";
import type { PaymentHistory, PaymentStatementInformation } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import useGetPaymentHistory from "../apiHooks/useGetPaymentHistory";

export default function useTenantStatement(){
    const { lease_id } = useParams<{ lease_id: string }>();   
    const [payments, setPayments] = useState<PaymentHistory[]>([])
    const [paginationData, setPaginationData] = useState<PaginationData>({} as PaginationData)
    const [statement, setStatement] = useState<PaymentStatementInformation>({} as PaymentStatementInformation)
    const componentReference = useRef<HTMLDivElement>(null);
    const { data, isLoading, error, refetch } = useGetPaymentHistory(lease_id);

    useEffect(() => {
        if (handleAxiosError("Failed to fetch payments", error)) return;
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
    const onDownloadPDF = useReactToPrint({
      contentRef: componentReference,
      documentTitle: `${statement.primary_tenant ? parseListString(statement.primary_tenant) : ""}_-_${new Date().toISOString()}`,
      pageStyle: `
            @page {
             margin: 0.3in;
            }
             
            body {
                margin: 0;
                padding: 0;
            }
        `,
   });

    return {
        lease_id,
        payments,
        statement,
        isLoading,
        paginationData,
        componentReference,
        setPaginationData,
        onDownloadPDF,
        setStatement,
        setPayments,
        refetch,
    }
}