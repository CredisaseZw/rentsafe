import { extractReceipts, getCurrentDate } from "@/lib/utils";
import type { Lease, PaymentMethod, ReceiptLease } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useReceipt(initialLease?: ReceiptLease) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [receipts, setReceipts] = useState<ReceiptLease[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialLease) {
        setReceipts([initialLease]);
        }
    }, [initialLease]);

    const onSelectLease = (index: number, lease: Lease) => {
        const primaryFullname =
        lease.tenants.find((t) => t.is_primary_tenant)?.tenant_object.full_name ?? "";

        setReceipts((prev) =>
        prev.map((r, i) =>
            i === index
            ? {
                lease_id: lease.lease_id,
                id: lease.id,
                customerName: primaryFullname,
                rentOwing: lease.owing,
                }
            : r
        )
        );
    };

    const updateReceipt = (index: number, key: string, value: any, updateRent? : boolean) => {
        setReceipts((prev) =>
        prev.map((r, i) =>
            i === index
            ? { 
                ...r, 
                [key]: value,
                currentRentOwing : updateRent ? 
                Number(r.rentOwing) - Number(value)
                : r.rentOwing
            }
            : r
        )
        );
    };

    const addReceipt = () => {
        setReceipts((prev) => [
        ...prev,
        {
            lease_id: "",
            id: 0,
            customerName: "",
            rentOwing: 0,
            payment_date : getCurrentDate(),
        } as ReceiptLease,
        ]);
    };

    const removeReceipt = (index: number) => {
        setReceipts((prev) => prev.filter((_, i) => i !== index));
    };
    
    const checkReceipt = (lease_id: string):boolean => {
        return receipts.some((r) => r.lease_id === lease_id);
    };

    const submitReceipts = (e: React.FormEvent<HTMLFormElement>, createReceipt:UseMutationResult<any, Error, void, unknown>)=>{
        e.preventDefault()

        const FORM = new FormData(e.currentTarget);
        const data = Object.fromEntries(FORM.entries())
        const receipts: ReceiptLease[] = extractReceipts(data);;
        console.log(receipts)
        
        const payments : {payments :ReceiptLease[]} = {
            payments : receipts
        }
        createReceipt.mutate(payments,{
            onError : (error) => {

            },
            onSuccess: (data) =>{
                
            }
        })
    }

    return {
        isOpen,
        loading,
        receipts,
        paymentMethods,
        setPaymentMethods,
        submitReceipts,
        removeReceipt,
        updateReceipt,
        onSelectLease,
        checkReceipt,
        setReceipts,
        setLoading,
        addReceipt,
        setIsOpen,
  };
}
