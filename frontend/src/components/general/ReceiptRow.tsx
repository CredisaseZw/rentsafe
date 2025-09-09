import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Lease, PaymentMethod, ReceiptLease } from '@/types'
import Fieldset from './Fieldset'
import ColumnsContainer from './ColumnsContainer'
import { Label } from '../ui/label'
import AutoCompleteLease from './AutoCompleteLease'
import { validateAmounts } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface props {
    index: number,
    paymentMethods : PaymentMethod[] | null,
    lease : ReceiptLease
    updateReceipt : (index: number, key: string, value: any,updateRent? : boolean ) => void;
    onSelectLease : (index: number ,lease: Lease) => void;
    removeReceipt : (index: number) => void;
    checkReceipt : (lease_id: string) => boolean;
}

export default function ReceiptRow({paymentMethods, index, lease, updateReceipt, onSelectLease, removeReceipt, checkReceipt} :props) {
    const [rent, setRent] = useState<string | undefined>("");
    useEffect(() => {
        if (!lease.amount || lease.amount.length === 0) {
            setRent(String(lease.rentOwing ?? 0));
        } else {
            setRent(String(lease.currentRentOwing ?? lease.rentOwing ?? 0));
        }
    }, [lease.amount, lease.rentOwing, lease.currentRentOwing]);

    return (
       <Fieldset legendTitle={lease.lease_id} className='relative'>
            <div className='flex flex-row gap-3'>
                <span>Rent owing:</span>
                <span className= {Number(rent) > 0 ? 'text-red-700' : "text-green-700"}>USD ({rent})</span>
            </div>
            <Input hidden value={lease.lease_id} name = {`lease_id_${index}`}/>
            <ColumnsContainer numberOfCols={2} marginClass='mt-3' gapClass='gap-6'>
                <AutoCompleteLease
                    index={index}
                    checkReceipt = {checkReceipt}
                    searchItem= {lease.customerName}
                    setSearchItem={updateReceipt}
                    onSelectValue={onSelectLease}
                />
                <div className='form-group'>
                <Label>Date</Label>
                <Input
                    type='date'
                    name = {`date_${index}`}
                    value={lease.payment_date}
                />
                </div>
            </ColumnsContainer>
            <ColumnsContainer numberOfCols={3} marginClass='mt-6' gapClass='gap-6'>
                <div className='form-group'>
                    <Label className='required'>Payment Method</Label>
                    <Select
                        name={`paymentMethod_${index}`}
                        required
                        defaultValue={String(paymentMethods?.[0].id)}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentMethods?.map((c) => (
                            <SelectItem value={String(c.id)} key={c.id}>
                                {c.payment_method_name.toUpperCase()}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='form-group'>
                    <Label className='required'>Receipt No.</Label>
                    <Input
                        required
                        name={`receipt_${index}`}
                    />
                </div>
                <div className='form-group'>
                    <Label className='required'>Received Amount</Label>
                   <Input
                        required
                        type="number"
                        step={0.01}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        onKeyDown={validateAmounts}
                        name={`received_${index}`}
                        value={lease.amount ?? ""}
                        onChange={(e) => updateReceipt(index, "amount", e.target.value, true)}
                        />
                </div>
            </ColumnsContainer>
            <div className='form-group mt-6'>
                <Label>Description</Label>
                <Textarea name = {"description"}></Textarea>
            </div>
            {
                index != 0 &&
                <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform">
                    <Button
                        className="rounded-full"
                        variant="DANGER"
                        size="icon"
                        type="button"
                        onClick={() => removeReceipt(index)}
                    >
                        <Trash2 />
                    </Button>
                </div>
            }
        </Fieldset>
  )
}
