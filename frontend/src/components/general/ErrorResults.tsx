import {XCircle} from "lucide-react"

interface props{
    message : string
}
export default function ErrorResults({message} : props){

    return(
        <div className='h-[25vh] flex flex-col items-center justify-center'>
            <XCircle size={35} className='mb-4 text-red-600'/>
            <h4 className='text-lg text-gray-600 dark:text-white'>{message}</h4>
        </div>
    )

}