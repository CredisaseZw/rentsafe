import type { Cashbook } from "@/types"
import { useEffect, useState } from "react"
import useGetCashbook from "../apiHooks/useGetCashbook";
import { handleAxiosError } from "@/lib/utils";

function useCashbookReceipt() {
    const [cashbooks, setCashbooks] = useState<Cashbook[]>([])
    const [page, setPage] = useState(1);
    const [cashbookCurrency, setCashbookCurrency] = useState("USD")
    const [receipts, setReceipts] = useState([
        {
            date: "19-Dec-25",
            receiptNumber: "RCPT-7742",
            type: "Cash Receipt",
            glAccount: "100101 – Cash on Hand",
            details: "Partial payment for Invoice INV-234",
            amount: 450.0,
            matching: "Unmatched",
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
    
    const addRow = () => setReceipts(p => [...p,   {
        date: "19-Dec-25",
        receiptNumber: "RCPT-7742",
        type: "Cash Receipt",
        glAccount: "100101 – Cash on Hand",
        details: "Partial payment for Invoice INV-234",
        amount: 450.0,
        matching: "Unmatched",
        invoiceRate: 1.0,
    }]);

    const adjustPaymentCurrency = (val:string) => {
        const cashbookCurrency_ = cashbooks.find((c)=> c.cashbook_id === val)?.currency.currency_code;
        if(cashbookCurrency_ && cashbookCurrency_ !== cashbookCurrency){
            return setCashbookCurrency(cashbookCurrency_)
        }
    }
    return {
        receipts,
        cashbooks,
        cashbookCurrency,
        adjustPaymentCurrency,
        addRow
    }
}

export default useCashbookReceipt