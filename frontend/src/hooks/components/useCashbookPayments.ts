import type { Cashbook } from "@/types"
import { useEffect, useState } from "react"
import useGetCashbook from "../apiHooks/useGetCashbook";
import { handleAxiosError } from "@/lib/utils";

function useCashbookPayments() {
    const [cashbooks, setCashbooks] = useState<Cashbook[]>([])
    const [page, setPage] = useState(1);
    const [paymentCurrency, setPaymentCurrency] = useState("USD")
    const [payments, setPayments] = useState([
        {
            date: "17-Dec-25",
            payRef: "PAY-8821",
            type: "Bank Transfer",
            glAccount: "100201 – Accounts Payable",
            details: "December rent payment",
            totalPay: 1285.75,
            vat: 185.75,
            matching: "Matched",
            invoiceRate: 1.0,
        }
    ])
    const {cashBooksData, cashbookError, isCashbookLoading} = useGetCashbook(page);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch latest cash-books", cashbookError)) return;
        if(!cashBooksData) return;
        
        setCashbooks((p)=> (
            page === 1 
            ? cashBooksData.results
            : [...p, ...cashBooksData.results]
        ))

        if(cashBooksData.next){
            const newPage = new URL(cashBooksData.next).searchParams.get("page");
            setPage(Number(newPage));
        }
    }, [cashBooksData, cashbookError, isCashbookLoading])
    const addRow = () => setPayments(p => [...p,   {
            date: "17-Dec-25",
            payRef: "PAY-8821",
            type: "Bank Transfer",
            glAccount: "100201 – Accounts Payable",
            details: "December rent payment",
            totalPay: 1285.75,
            vat: 185.75,
            matching: "Matched",
            invoiceRate: 1.0,
        }]);
    const adjustPaymentCurrency = (val:string) => {
        const cashbookCurrency = cashbooks.find((c)=> c.cashbook_id === val)?.currency.currency_code;
        if(cashbookCurrency && cashbookCurrency !== paymentCurrency){
            return setPaymentCurrency(cashbookCurrency)
        }
    }
    return {
        payments,
        cashbooks,
        paymentCurrency,
        adjustPaymentCurrency,
        addRow
    }
}

export default useCashbookPayments