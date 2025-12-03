import Button from "@/components/general/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"
import type { ConfirmRatePrompt } from "@/interfaces"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
interface props {
    open :  boolean,
    limit:  number,
    prompt : ConfirmRatePrompt
    current : number,
    ResetPrompts : ()=>void;
    next  : React.Dispatch<React.SetStateAction<number>>
    updateBase: (from:string, to: string, rate: number) => void
    setOpen :React.Dispatch<React.SetStateAction<boolean>>
}

function ConfirmRateSwitchDialogue({prompt, open, limit, current, setOpen, updateBase, next, ResetPrompts}:props) {
    const [rate, setRate] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (current > limit) {
            return ResetPrompts();
        }
        if(prompt?.rate) setRate(String(prompt.rate))

    }, [current, limit, setOpen]);

    const onSwitch = () => {
        const newRate = parseFloat(rate);
        if (newRate > 0 && !isNaN(newRate)) {
            updateBase(prompt.from, prompt.to, newRate);
            next(prev => prev + 1);
        }
    };

    const editRate = () => navigate(`${RENTSAFE_PRE_SEG}/settings/currency`)

    return (
        <Dialog 
            open = {open}
            onOpenChange={setOpen}
        >
            <DialogContent 
                showCloseButton = {false}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}            
                onInteractOutside={(e)=>e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Confirm Rate.</DialogTitle>
                    <DialogDescription>Confirm Rate for item ({prompt?.itemName ?? "" })</DialogDescription>
                </DialogHeader>
                
                <div id="prompt" className="mt-5">
                    <div className="form-group">
                        <Label>{prompt?.from ?? ""} to {prompt?.to ?? ""}</Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>$</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput placeholder="0.00"
                            value={rate}
                                onChange={(e)=> setRate(e.target.value)}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupText>{prompt?.to}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
                <DialogFooter>
                    {
                        Number(prompt?.rate) === 1 &&
                        <Button variant="outline" onClick={editRate}>Edit Currency Setting</Button>
                    }
                    <Button  onClick={onSwitch}>Set Rate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
)
}

export default ConfirmRateSwitchDialogue