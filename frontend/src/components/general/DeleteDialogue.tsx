import Button from '@/components/general/Button'
import ButtonSpinner from '@/components/general/ButtonSpinner'
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useDeleteCategory from '@/hooks/apiHooks/useDelete'
import type { Delete } from '@/types'
import { Trash } from 'lucide-react'

function DeleteDialogue({mutationFunc, keyStore, value, trigger }: Delete) {
  const {
    loading,
    open,
    setOpen, 
    onHandleDelete
  } = useDeleteCategory({mutationFunc, keyStore, value })
  return (
    <Dialog open = {open} onOpenChange={setOpen}>
        <DialogTrigger>
            {
                trigger 
                ? trigger
                : <Trash size={15} className="text-red-600"/>
            }
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]" onInteractOutside={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle className='text-lg font-semibold'>Delete {value}</DialogTitle>
                <DialogDescription className='text-sm text-muted-foreground'>
                    Are you sure you want to delete this {value}? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-row justify-end gap-3 mt-4'>
                <Button variant="outline" size="md" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button variant="danger" disabled = {loading} size="md" onClick={()=> onHandleDelete()}>
                    {
                        loading 
                        ? <ButtonSpinner/>
                        : "Delete"
                    }
                </Button>
            </div>
        </DialogContent>  
    </Dialog>
  )
}

export default DeleteDialogue