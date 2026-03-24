import { Send } from "lucide-react"
import { DialogClose, DialogFooter } from "../ui/dialog"
import ButtonSpinner from "./ButtonSpinner"
import { Button } from "../ui/button"

interface props{
    loading?: boolean,
    form: string
}

function CustomDialogFooter({loading, form}:props) {
    return (
        <DialogFooter>
            <DialogClose>
                <Button variant="ghost">
                    Close
                </Button>
            </DialogClose>
            <Button form={form} >
                {
                    !loading 
                    ?<Send/>
                    : <ButtonSpinner/>
                }
                Submit
            </Button>
        </DialogFooter>
    )
}

export default CustomDialogFooter