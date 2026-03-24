import { Edit } from 'lucide-react'

interface props {
    size?: number;
    className?: string;
}
function EditIcon({ size = 15, className }: props) {
  return (
    <Edit size={size} className={`text-gray-700 self-center dark:text-white ${className}`}/>
  )
}

export default EditIcon