import {FolderOpen} from "lucide-react"

interface props{
    message : string,
    option?: React.ReactNode
}
export default function EmptyResults({message,option } : props){

    return(
        <div className='h-[25vh] flex flex-col items-center justify-center'>
            <FolderOpen size={35} className='mb-4 text-gray-500 dark:text-white'/>
            <h4 className='text-lg text-gray-600 dark:text-white'>{message}</h4>
            <div className="mt-4 flex flex-col items-center justify-center">
                {option}
            </div>
        </div>
    )

}