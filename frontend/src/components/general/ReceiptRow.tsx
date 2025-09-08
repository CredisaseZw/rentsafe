import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PaymentMethod } from '@/types'
import Fieldset from './Fieldset'
import ColumnsContainer from './ColumnsContainer'
import { Label } from '../ui/label'
import AutoCompleteLease from './AutoCompleteLease'
import { getCurrentDate, validateAmounts } from '@/lib/utils'
import { Textarea } from '../ui/textarea'

interface props {
    index: number,
    paymentMethods : PaymentMethod[] | null
}
export default function ReceiptRow({paymentMethods, index} :props) {
   
  return (
       <Fieldset legendTitle='Primary Receipt'>
            <div className='flex flex-row gap-3'>
                <span>Rent owing:</span>
                <span className='text-red-700'>USD (700)</span>
            </div>
            <ColumnsContainer numberOfCols={2} marginClass='mt-6' gapClass='gap-6'>
                <div className='form-group'>
                    <Label>Customer Name</Label>
                    <AutoCompleteLease/>
                </div>
                <div className='form-group'>
                <Label>Date</Label>
                <Input
                    type='date'
                    name = {`date_${index}`}
                    value={getCurrentDate()}
                />
                </div>
            </ColumnsContainer>
            <ColumnsContainer numberOfCols={3} marginClass='mt-6' gapClass='gap-6'>
                <div className='form-group'>
                    <Label>Payment Method</Label>
                    <Select name={`paymentMethod_${index}`} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                            {   paymentMethods &&
                                paymentMethods.map((c:PaymentMethod)=>
                                <SelectItem value={String(c.id)} key={c.id} >{c.payment_method_name.toUpperCase()}</SelectItem>
                                )
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className='form-group'>
                    <Label>Receipt No.</Label>
                    <Input
                        name={`receipt_${index}`}
                    />
                </div>
                <div className='form-group'>
                    <Label>Received Amount</Label>
                    <Input
                        type= "number" 
                        step={0.01}
                        onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                        onKeyDown={validateAmounts}
                        name={`received_${index}`}
                    />
                </div>
            </ColumnsContainer>
            <div className='form-group mt-6'>
                <Label>Description</Label>
                <Textarea name = {"description"}></Textarea>
            </div>
        </Fieldset>
  )
}
