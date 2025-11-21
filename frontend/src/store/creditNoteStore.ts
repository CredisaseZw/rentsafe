import { Store } from "@tanstack/store";

interface CreditNotesStore  {
    refetchNotes: (()=> void) | null
}

export const creditNotesStore = new Store<CreditNotesStore>({
    refetchNotes : null
})

export const setCreditNoteStore = (fn : ()=> void) =>{
    creditNotesStore.setState({refetchNotes : fn})
}

export const getCreditNoteStore = () => creditNotesStore.state.refetchNotes?.()