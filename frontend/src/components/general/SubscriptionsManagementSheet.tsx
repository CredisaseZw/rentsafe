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
import LoadingIndicator from "./LoadingIndicator"
import { SUBSCRIPTION_HEADERS } from "@/constants"

export function SubscriptionSheet() {
  const { open, subscription, isLoading,setOpen } =useSubscriptionsSheets()


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-white font-semibold">
          View Subscriptions <ChevronUp />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-fit 2xl:bottom-0 xl:bottom-0 md:bottom-[0px] sm:bottom-[18px]">
        <SheetHeader>
          <SheetTitle>Available Subscriptions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
          <TableBase headers={SUBSCRIPTION_HEADERS}>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={SUBSCRIPTION_HEADERS.length}>
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