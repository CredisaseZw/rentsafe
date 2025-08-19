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
import { useState } from "react"
import ActiveIndividualLease from "../routes/rent-safe/tenant-leases/ActiveIndividualLease"

export function SubscriptionSheet() {
    const [open, setOpen] = useState(false)
    const headers = [
        {
            name: "No",
            textAlign: "center"
        },
        {
            name: "Open Slots",
            textAlign: "center"
        },
        {
            name: "Period (Months)",
            textAlign: "center"
        },
        {
            name: "Start Date",
            textAlign: "center"
        },
        {
            name: "End Date",
            textAlign: "center"
        },
    ]
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
                <TableCell className="baseCellClass text-center">1</TableCell>
                <TableCell className="baseCellClass text-center">2</TableCell>
                <TableCell className="baseCellClass text-center">12</TableCell>
                <TableCell className="baseCellClass text-center">22-May-25</TableCell>
                <TableCell className="baseCellClass text-center">22-May-26</TableCell>
                <TableCell className="baseCellClass flex justify-center items-center flex-row gap-3.5">
                    <ActiveIndividualLease />
                    <Button variant={"SUCCESS"}>Activate Company</Button>
                </TableCell>
            </TableRow>
        </TableBase>
        </div>
      </SheetContent>
    </Sheet>
  )
}
