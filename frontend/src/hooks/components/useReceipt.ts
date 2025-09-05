import type { Header, PaymentMethod } from "@/types";
import { useState } from "react";

export default function useReceipt(){
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null)
    const [isOpen, setIsOpen] = useState(false);
    const headers: Header[] =[
        {name : "Date"},
        {name : "Customer Name"},
        {name : "Receipt No."},
        {name :"Description"},
        {name : "Payment Method"},
        {name : "Amount Owing"},
        {name : "Amount Paid"},
        {name : "Balance" }
    ]
    return {
        isOpen,
        headers,
        paymentMethods,
        setPaymentMethods,
        setIsOpen
    }
}