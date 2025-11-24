import Button from "@/components/general/Button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SwitchRate } from "@/interfaces"
import { useEffect, useState } from "react"

interface props {
    updateBase: React.Dispatch<React.SetStateAction<number | undefined>>
    open :  boolean,
    setOpen :React.Dispatch<React.SetStateAction<boolean>>
    switchRate : SwitchRate
}

function ConfirmRateSwitchDialogue({switchRate, open, setOpen, updateBase}:props) {
    const [rate, setRate] = useState("")
    useEffect(()=>{
        if(switchRate.rate)setRate(String(switchRate.rate))
    }, [switchRate.rate])

    const onSwitch = () =>{
        const newRate = Number(rate)
        if(newRate > 0 &&
            !isNaN(newRate)
        )
        {   
            updateBase(newRate);
            setOpen(false);
        }
    }
    return (
        <Dialog 
            open = {open}
            onOpenChange={setOpen}
        >
            <DialogContent 
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}            
                onInteractOutside={(e)=>e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Switch currency</DialogTitle>
                    <DialogDescription>Set the desired rate</DialogDescription>
                </DialogHeader>
                
                <div className="mt-5">
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
                    <DialogClose>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSwitch}>Set Rate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
)
}

export default ConfirmRateSwitchDialogue