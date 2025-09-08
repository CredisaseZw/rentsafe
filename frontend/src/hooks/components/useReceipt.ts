import type { PaymentMethod } from "@/types";
import { useState } from "react";

export default function useReceipt(){
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null)
    const [isOpen, setIsOpen] = useState(false);
    const [receipts,setReceipts] = useState<undefined[]>([undefined])

    return {
        isOpen,
        paymentMethods,
        receipts,
        setReceipts,
        setPaymentMethods,
        setIsOpen
    }
}