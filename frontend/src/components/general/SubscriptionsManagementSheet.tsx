import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { TableBase } from "./TableBase"
import { TableCell, TableRow } from "../ui/table"
import ActivateLease from "../routes/rent-safe/tenant-leases/ActivateLease"
import useSubscriptionsSheets from "@/hooks/components/useSubscriptionSheets"
import useGetSubscriptions from "@/hooks/apiHooks/useGetSubscriptions"
import { useEffect } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import type { LeaseSubscription, LeaseSubscriptionResponse } from "@/types"
import LoadingIndicator from "./LoadingIndicator"

export function SubscriptionSheet() {
  const { open, subscription, setSubscription, setOpen, headers } =useSubscriptionsSheets()
  const { data, isLoading, error } = useGetSubscriptions()

  useEffect(() => {
    if (isAxiosError(error)) {
      const message =
        error.response?.data.error ?? error.response?.data.detail
      toast.error("Failed to fetch lease subscriptions", {
        description: message || "Something went wrong",
      })
      return
    }

    if (data) {
      (data as LeaseSubscriptionResponse).results.forEach(
        (leaseSubscription: LeaseSubscription) => {
          if (leaseSubscription.sub_type === "RENTSAFE") {
            setSubscription(leaseSubscription)
          }
        }
      )
    }
  }, [data, error, setSubscription])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-white font-semibold">
          View Subscriptions <ChevronUp />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[25vh]">
        <SheetHeader>
          <SheetTitle>Available Subscriptions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
          <TableBase headers={headers}>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <div className="flex justify-center items-center">
                    <LoadingIndicator />
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && subscription && (
              <TableRow>
                <TableCell className="text-center">{subscription.id}</TableCell>
                <TableCell className="text-center">{subscription.open_slots}</TableCell>
                <TableCell className="text-center">{subscription.period}</TableCell>
                <TableCell className="text-center">{subscription.start_date}</TableCell>
                <TableCell className="text-center">{subscription.end_date}</TableCell>
                <TableCell className="flex justify-center items-center gap-3.5">
                  <ActivateLease
                    isDisabled={subscription.open_slots === 0}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBase>
        </div>
      </SheetContent>
    </Sheet>
  )
}
