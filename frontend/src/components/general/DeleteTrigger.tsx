import { Trash } from 'lucide-react'

function DeleteTrigger() {
  return (
    <div className="cursor-pointer flex flex-row gap-3 text-red-600">
        <Trash size={15} className="self-center"/>
        Delete
    </div>  )
}

export default DeleteTrigger