import Button from "@/components/general/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"
import type { SwitchRate } from "@/interfaces"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface props {
    updateBase: (from:string, to: string, rate: number) => void
    open :  boolean,
    setOpen :React.Dispatch<React.SetStateAction<boolean>>
    switchRate : SwitchRate
}

function ConfirmRateSwitchDialogue({switchRate, open, setOpen, updateBase}:props) {
    const [rate, setRate] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        if(switchRate.rate) setRate(String(switchRate.rate))
    }, [switchRate.rate])

    const onSwitch = () =>{
        const newRate = parseFloat(rate)
        if(newRate > 0 &&
        !isNaN(newRate)){   
            updateBase(switchRate.from ?? "", switchRate.to ?? "", newRate);
            setOpen(false);
        }
    }

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
                    <DialogTitle>Switch currency</DialogTitle>
                    <DialogDescription>Set the desired rate</DialogDescription>
                </DialogHeader>
                
                <div id="switchRate" className="mt-5">
                    <div className="form-group">
                        <Label>{switchRate.from ?? ""} to {switchRate.to ?? ""}</Label>
                        <Input
                            name="rate"
                            value={rate}
                            onChange={(e)=> setRate(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {
                        Number(switchRate.rate) === 1 &&
                        <Button variant="outline" onClick={editRate}>Edit Currency Setting</Button>
                    }
                    <Button  onClick={onSwitch}>Set Rate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
)
}

export default ConfirmRateSwitchDialogue