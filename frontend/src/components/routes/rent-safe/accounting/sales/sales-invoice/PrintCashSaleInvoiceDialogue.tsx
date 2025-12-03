import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CashSaleInvoice from "./CashSaleInvoice";
import { DialogClose } from "@radix-ui/react-dialog";
import Button  from "@/components/general/Button";
import { Printer } from "lucide-react";
import type { CashSale } from "@/interfaces";

interface props{
  open : boolean,
  setOpen :  React.Dispatch<React.SetStateAction<boolean>>
  cashSale :CashSale 
}

function PrintCashSaleInvoiceDialogue({open, cashSale, setOpen}:props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <Dialog open = {open} onOpenChange={setOpen}>
      <DialogContent 
        onInteractOutside={(e)=> e.preventDefault()}
        className="sm:max-w-[1000px] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print cash sale.</DialogTitle>
          <DialogDescription>Do you wish to print the cash sale?</DialogDescription>
        </DialogHeader>
         <div ref={printRef}>
          <CashSaleInvoice cashSale={cashSale}/>
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

export default PrintCashSaleInvoiceDialogue