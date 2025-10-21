import { useState } from "react";

export default function useCashbooks(){
    const [open, setOpen]= useState(false)
    
    return {
        open,
        setOpen
    }
}