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
import ActiveCompanyLease from "../routes/rent-safe/tenant-leases/ActivateCompanyLeases"
import type { Header } from "@/types"

export function SubscriptionSheet() {
    const [open, setOpen] = useState(false)
    const headers:Header[] = [
        {
            name: "No",
            
        },
        {
            name: "Open Slots",
            
        },
        {
            name: "Period (Months)",
            
        },
        {
            name: "Start Date",
            
        },
        {
            name: "End Date",
            
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
                <TableCell className=" text-center">1</TableCell>
                <TableCell className=" text-center">2</TableCell>
                <TableCell className=" text-center">12</TableCell>
                <TableCell className=" text-center">22-May-25</TableCell>
                <TableCell className=" text-center">22-May-26</TableCell>
                <TableCell className=" flex justify-center items-center flex-row gap-3.5">
                    <ActiveIndividualLease />
                    <ActiveCompanyLease />
                </TableCell>
            </TableRow>
        </TableBase>
        </div>
      </SheetContent>
    </Sheet>
  )
}
