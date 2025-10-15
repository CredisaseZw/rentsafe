import { extractReceipts, getCurrentDate } from "@/lib/utils";
import type { Lease, LeaseReceiptPayload, PaymentMethod, ReceiptLease } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetPaymentMethods from "../apiHooks/useGetPaymentMethods";

export default function useReceipt(initialLease?: ReceiptLease) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [receipts, setReceipts] = useState<ReceiptLease[]>([]);
    const [loading, setLoading] = useState(false);
    const {data, error} = useGetPaymentMethods();

    useEffect(() => {
        if (initialLease) {
        setReceipts([initialLease]);
        }
    }, [initialLease]);
    
    useEffect(()=>{
        if(isAxiosError(error)){
            console.log(error)
            const message = error.response?.data.error ?? error.response?.data.detail ?? "Something went wrong";
            toast.error("Error fetching payment methods", {description : message});
        }

        if(data){
            setPaymentMethods(data as PaymentMethod[])
        }
    }, [data, error])

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

    const submitReceipts = (
        e: React.FormEvent<HTMLFormElement>, 
        createReceipt: UseMutationResult< any,Error,{ payments: ReceiptLease[] },unknown>,
        onSuccessCallback? : (payload?: LeaseReceiptPayload[] )=> void 
    ) => {
        e.preventDefault()
        setLoading(true)
        const FORM = new FormData(e.currentTarget);
        const data = Object.fromEntries(FORM.entries())
        const receipts: ReceiptLease[] = extractReceipts(data, !!initialLease?.is_rent_variable);
        
        // VALIDATE BY LEASE_ID { FILTER FOR EMPTY OBJECTS }
        const invalid = receipts.filter((r) => !r.lease_id || r.lease_id.trim() === '');
        if (invalid.length > 0) return toast.error("Fill in all receipts", {description:"Empty receipt body detected"})
        
        const payments: { payments: ReceiptLease[] } = { payments: receipts };

        createReceipt.mutate(payments, {
        onError: (error) => {
            if(isAxiosError(error)){
                const message = error.response?.data.error ?? error.response?.data.details ?? "Something went wrong";
                toast.error("Error occurred creating a receipt", {description : message})
            }
        },
        onSuccess: (data) => {
            if(data) {
                if(data.errors.length > 0) return toast.error("Error occurred creating a receipt", )
                toast.success("Receipt created successfully")
                setIsOpen(false);
                if (onSuccessCallback) onSuccessCallback(data.results)
            }
        },
        onSettled : () => setLoading(false)
        });
    }

    return {
        isOpen,
        loading,
        receipts,
        paymentMethods,
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
