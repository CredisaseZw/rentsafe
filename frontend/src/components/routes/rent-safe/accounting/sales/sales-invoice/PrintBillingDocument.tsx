import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DialogClose } from "@radix-ui/react-dialog";
import Button  from "@/components/general/Button";
import { Printer, PrinterIcon } from "lucide-react";
import type { CashSale, CreditNote, Invoice } from "@/interfaces";
import BillingPrint from "./BillingPrint";

interface props{
  open? : boolean,
  setOpen? :  React.Dispatch<React.SetStateAction<boolean>>
  bill : CashSale | Invoice | CreditNote 
  billTitle : string
}

function PrintBillingDocument({open, bill, setOpen, billTitle}:props) {
  const [openControl, setOpenControl] = useState(false);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <Dialog open = {
      typeof(open) === "undefined" 
      ? openControl 
      : open
    } onOpenChange={
      typeof(open) === "undefined" 
      ? setOpenControl
      : setOpen
      }>
      {
        typeof(open) === "undefined" &&
        <DialogTrigger>
          <Button variant={"success"} asChild>
            <PrinterIcon size={15}/>
            Print
          </Button>
        </DialogTrigger>
      }
      <DialogContent 
        className="sm:max-w-[1000px] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print {billTitle.toLowerCase() ?? "invoice"}.</DialogTitle>
          <DialogDescription>Do you wish to print this {billTitle.toLowerCase() ?? "invoice"}?</DialogDescription>
        </DialogHeader>
         <div ref={printRef}>
          <BillingPrint
            bill={bill}
          />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button variant={"success"} onClick={handlePrint} asChild>
            <Printer size={15}/>
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PrintBillingDocument