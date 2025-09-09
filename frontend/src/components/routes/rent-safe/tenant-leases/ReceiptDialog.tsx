import StaticBadge from '@/components/general/StaticBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import useReceipt from '@/hooks/components/useReceipt'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { useEffect } from 'react'
import { isAxiosError } from 'axios'
import useGetPaymentMethods from '@/hooks/apiHooks/useGetPaymentMethods'
import { toast } from 'sonner'
import type { PaymentMethod, ReceiptLease } from '@/types'
import ReceiptRow from '@/components/general/ReceiptRow'
import { Plus, Send } from 'lucide-react'
import useCreateReceipt from '@/hooks/apiHooks/useCreateReceipt'
import ButtonSpinner from '@/components/general/ButtonSpinner'

interface props {
  lease : ReceiptLease
}

function ReceiptDialog({lease}: props) {
  const { 
    isOpen,
    loading,
    receipts,
    paymentMethods,
    setPaymentMethods,
    submitReceipts,
    removeReceipt,
    updateReceipt,
    onSelectLease,
    checkReceipt,
    addReceipt,
    setIsOpen 
  } = useReceipt(lease);  
  const {data, error} = useGetPaymentMethods();
  const createReceipt = useCreateReceipt();

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
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[900px] sm:max-w-[default] p-7 max-h-[90vh] overflow-y-auto overflow-x-auto`}>
          <DialogTitle><h6 className='font-semibold'>Rent receipt</h6></DialogTitle>
          <form onSubmit={(e) =>submitReceipts(e, createReceipt)}>
              {
                receipts.map((lease, index: number)=>
                  <ReceiptRow
                    removeReceipt = {removeReceipt}
                    onSelectLease = {onSelectLease}
                    updateReceipt = {updateReceipt}
                    checkReceipt = {checkReceipt}
                    lease = {lease}
                    paymentMethods={paymentMethods}
                    index={index}
                    key={index}/>
                )
              }
              <div className='mt-8 flex flex-row gap-3 justify-end'>
                <Button
                  variant={"outline"}
                  type='button'
                  onClick={()=> addReceipt()}
                  >
                  <Plus />
                  Add Another
                </Button>
                <Button type='submit' disabled = {loading}>
                  {
                    loading ?
                    <ButtonSpinner/> :
                    <Send/>
                  }
                  Submit
                </Button>
              </div>
          </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReceiptDialog