import type { PaginationData } from "@/interfaces";
import { parseListString } from "@/lib/utils";
import type { PaymentHistory, PaymentStatementInformation } from "@/types";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export default function useTenantStatement(){
    const { lease_id } = useParams<{ lease_id: string }>();   
    const [payments, setPayments] = useState<PaymentHistory[]>([])
    const [paginationData, setPaginationData] = useState<PaginationData>({} as PaginationData)
    const [statement, setStatement] = useState<PaymentStatementInformation>({} as PaymentStatementInformation)
    const componentReference = useRef<HTMLDivElement>(null);

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
        paginationData,
        componentReference,
        setPaginationData,
        onDownloadPDF,
        setStatement,
        setPayments,
    }
}