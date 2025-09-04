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

export function SubscriptionSheet() {
    const {  
      open,
      setOpen,
      headers} = useSubscriptionsSheets()
  return (
    <Sheet open = {open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="text-white font-semibold">View Subscriptions <ChevronUp/></Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[25vh]">
        <SheetHeader>
          <SheetTitle>Available Subscriptions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
        <TableBase headers={headers}>
            <TableRow>
                <TableCell className=" text-center">1</TableCell>
                <TableCell className=" text-center">2</TableCell>
                <TableCell className=" text-center">12</TableCell>
                <TableCell className=" text-center">22-May-25</TableCell>
                <TableCell className=" text-center">22-May-26</TableCell>
                <TableCell className=" flex justify-center items-center flex-row gap-3.5">
                    <ActivateLease />
                </TableCell>
            </TableRow>
        </TableBase>
        </div>
      </SheetContent>
    </Sheet>
  )
}
