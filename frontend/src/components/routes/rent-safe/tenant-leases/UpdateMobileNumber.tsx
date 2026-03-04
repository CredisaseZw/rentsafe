import { useState, type Dispatch, type SetStateAction } from 'react'
import ButtonSpinner from "@/components/general/ButtonSpinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { PHONE_TYPES } from '@/constants';
import type {  TenantSelection } from '@/types';
import useUpdateIndividual from '@/hooks/apiHooks/useUpdateIndividual';
import { toast } from 'sonner';
import SelectElement from '@/components/general/SelectElement';
import { handleAxiosError } from '@/lib/utils';

interface Props {
  open: boolean,
  setUpdateIndividual:  Dispatch<SetStateAction<TenantSelection | null>>
  setOpen: Dispatch<SetStateAction<boolean>>,
  updateIndividual : TenantSelection | null
}

function UpdateMobileNumber({ updateIndividual, open, setOpen, setUpdateIndividual }: Props) {
  const [mobileType, setMobileType] = useState<string>("mobile");
  const updateNumber = useUpdateIndividual();
  const [loading, setLoading] = useState(false);

  function updateNumber_() {
    if(!updateIndividual) return setOpen(false)
    setLoading(true)
    const payload = {
        PAYLOAD :{
          "contact_details": [
            {
              "phone_number": updateIndividual.mobile_number,
              "type": mobileType
            }
          ]
        },
        USER_ID : updateIndividual.id
    }

    updateNumber.mutate(payload, {
      onSuccess: () => {
        setUpdateIndividual(null)
        setOpen(false);
        toast.success("Update Status", { description: `${updateIndividual.full_name}'s mobile number successfully updated to ${updateIndividual.mobile_number}` });
  
      },
      onError: (error) => { handleAxiosError("Update failed", error)},
      onSettled: ()=> setLoading(false)    
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white">Update Mobile number</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-white mt-5">
            <span className='mb-5'>
              Do you want to update {updateIndividual?.full_name}'s mobile number? If so, please provide the phone type.
            </span>
            <div className='mt-5'>
              <SelectElement
                
                onValChange={(val) => setMobileType(val)}
                options={PHONE_TYPES}
                firstIsDefault = {true}
              />
            </div>
          
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-5'>
          <div className="flex w-full flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>No</Button>
            <Button onClick={() => updateNumber_()} disabled={loading}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {loading ? <ButtonSpinner /> : "Yes, Update"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateMobileNumber
