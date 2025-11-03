import { handleAxiosError } from "@/lib/utils"
import type { LeaseSubscription, LeaseSubscriptionResponse } from "@/types"
import { useEffect, useState } from "react"
import useGetSubscriptions from "../apiHooks/useGetSubscriptions"

export default function useSubscriptionsSheets(){
    const [open, setOpen] = useState(false)
    const [subscription, setSubscription] = useState<LeaseSubscription | null>(null)
    const { data, isLoading, error } = useGetSubscriptions()

    useEffect(() => {
        if(handleAxiosError("Failed to fetch lease subscriptions", error)) return;
        if (data) {
            (data as LeaseSubscriptionResponse).results.forEach((leaseSubscription: LeaseSubscription) => {
                if (leaseSubscription.sub_type === "RENTSAFE") {
                    setSubscription(leaseSubscription)
                }
            })
        }
    }, [data, error, setSubscription])
    return {
        open,
        isLoading,
        subscription,
        setSubscription,
        useState,
        setOpen,
    }
}