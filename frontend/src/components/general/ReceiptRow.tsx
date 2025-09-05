import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from '../ui/table'
import StaticBadge from './StaticBadge'
import { riskLevelColorCode } from '@/lib/utils'
import type { PaymentMethod } from '@/types'

interface props {
    paymentMethods : PaymentMethod[] | null
}
export default function ReceiptRow({paymentMethods} :props) {
   
  return (
    <TableRow noHover = {true}>
        <TableCell>
            <Input 
            type="date" 
            />
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
            <Input type='text' name='receipt_no'/>
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
            <Select defaultValue={""}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
                {   paymentMethods &&
                    paymentMethods.map((p:PaymentMethod, index: number)=>(
                        <SelectItem value={String(p.id)} key={index}>{p.payment_method_name}</SelectItem>
                    ))
                }
            </SelectContent>
            </Select>
        </TableCell>
        <TableCell>
            <StaticBadge bgColor={riskLevelColorCode("HIGH")}>
            <span className='py-1'>
                5000
            </span>
            </StaticBadge>
        </TableCell>
        <TableCell>
            <Input type='tet'/>
        </TableCell>
        <TableCell className='text-center'>
            <span className='text-green-600'>500</span>
        </TableCell>
    </TableRow>
  )
}
