import StaticBadge from '@/components/general/StaticBadge'
import { TableBase } from '@/components/general/TableBase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import useReceipt from '@/hooks/components/useReceipt'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import ReceiptRow from '@/components/general/ReceiptRow'
import { useEffect } from 'react'
import { isAxiosError } from 'axios'
import useGetPaymentMethods from '@/hooks/apiHooks/useGetPaymentMethods'
import { toast } from 'sonner'
import type { PaymentMethod } from '@/types'


function ReceiptDialog() {
  const { 
    isOpen,
    headers,
    paymentMethods,
    setPaymentMethods,
    setIsOpen } = useReceipt();  
  const {data, error} = useGetPaymentMethods();

  useEffect(()=>{
      if(isAxiosError(error)){
          console.log(error)
          const message = error.response?.data.error ?? error.response?.data.detail ?? "Something went wrong";
          toast.error("Error fetching payment methods", {description : message});
      }

      if(data){
        setPaymentMethods(data.results as PaymentMethod[])
      }
  }, [data, error])
  return (
    <Dialog
        modal
        open = {isOpen}
        onOpenChange={setIsOpen}
    >
        <DialogTrigger asChild>
           <StaticBadge bgColor="bg-blue-600">   
                <Button variant={"ghost"} onClick={()=> setIsOpen(true)}>Receipt</Button>
            </StaticBadge>  
        </DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[1100px] sm:max-w-[default] p-7 max-h-[90vh] overflow-y-auto overflow-x-auto`}>
            <DialogTitle><h6 className='font-semibold'>Rent receipt</h6></DialogTitle>
            <div className='mt-1'>
                <TableBase headers={headers}>
                  <ReceiptRow paymentMethods = {paymentMethods}/>
                </TableBase>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ReceiptDialog