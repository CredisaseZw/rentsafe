import { extractReceipts, getCurrentDate, getFormDataObject, handleAxiosError } from "@/lib/utils";
import type { Cashbook, Lease, LeaseReceiptPayload, PaymentMethod, ReceiptLease } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetPaymentMethods from "../apiHooks/useGetPaymentMethods";
import useGetCashbook from "../apiHooks/useGetCashbook";

export default function useReceipt(initialLease?: ReceiptLease) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [receipts, setReceipts] = useState<ReceiptLease[]>([]);
    const [loading, setLoading] = useState(false);
    const {data, error} = useGetPaymentMethods();

    const [cashbooks, setCashBooks] = useState<Cashbook[]>([]);
    const [page, setPage] = useState(1);
    const {cashBooksData, isCashbookLoading, cashbookError} = useGetCashbook(page);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch Cashbooks", cashbookError)) return;
        if(cashBooksData){
            setCashBooks((p)=>
                page === 1 
                ? cashBooksData.results
                : [...p, ...cashBooksData.results]
            )
            if(cashBooksData.next){
                const nextPage = new URL(cashBooksData?.next).searchParams.get("page")
                setPage(Number(nextPage))
            }
           
        }
    }, [cashBooksData, cashbookError, page])
    
    useEffect(() => {
        if (initialLease) {
            setReceipts([initialLease]);
        }
    }, [initialLease]);
    
    useEffect(()=>{
        if(handleAxiosError("Error fetching payment methods", error)) return;
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
    const updateReceipt = (
        index: number,
        key: string,
        value: any,
        updateRent?: boolean
    ) => {
    setReceipts(prev =>
        prev.map((r, i) => {
        if (i !== index) return r;

        const updated = {
            ...r,
            [key]: value,
        };

        if (updateRent) {
            updated.currentRentOwing =
            Number(r.rentOwing) - Number(value);
        }

        if (key === "opc" || key === "rent") {
            const rent = Number(
            key === "rent" ? value : r.rent
            );
            const opc = Number(
            key === "opc" ? value : r.opc
            );
            updated.amount = String(rent + opc);
        }

        return updated;
        })
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
            is_rent_variable:  !!initialLease?.is_rent_variable
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
        const data = getFormDataObject(e);
        const receipts: ReceiptLease[] = extractReceipts(data, !!initialLease?.is_rent_variable);
        
        // VALIDATE BY LEASE_ID { FILTER FOR EMPTY OBJECTS }
        const invalid = receipts.filter((r) => !r.lease_id || r.lease_id.trim() === '');
        if (invalid.length > 0) return toast.error("Fill in all receipts", {description:"Empty receipt body detected"})
        
        const payments: { payments: ReceiptLease[] } = { payments: receipts };

        createReceipt.mutate(payments, {
        onError: (error) => {handleAxiosError("Error occurred creating a receipt", error);},
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
        cashbooks,
        paymentMethods,
        isCashbookLoading,
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
