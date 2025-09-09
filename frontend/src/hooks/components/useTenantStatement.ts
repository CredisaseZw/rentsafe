import type { PaginationData } from "@/interfaces";
import type { PaymentHistory, PaymentStatementInformation } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function useTenantStatement(){
    const { lease_id } = useParams<{ lease_id: string }>();   
    const [payments, setPayments] = useState<PaymentHistory[]>([])
    const [paginationData, setPaginationData] = useState<PaginationData>({} as PaginationData)
    const [statement, setStatement] = useState<PaymentStatementInformation>({} as PaymentStatementInformation)

    return {
        lease_id,
        payments,
        statement,
        paginationData,
        setPaginationData,
        setStatement,
        setPayments,
    }
}