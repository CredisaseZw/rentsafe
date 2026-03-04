import { EllipsisVertical } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'

interface props {
    children  : React.ReactNode
}
function OptionsWrapper({children}:props) {
    return (
    <Popover>
        <PopoverTrigger>
            <div className='p-1.5 border cursor-pointer bg-gray-100 dark:bg-zinc-900 flex justify-center items-center border-color rounded-full'>
                <EllipsisVertical size={10}/>
            </div>
        </PopoverTrigger>
        <PopoverContent className='flex flex-col gap-3 cursor-pointer'>
            {children}
        </PopoverContent>
    </Popover>
  )
}

export default OptionsWrapper