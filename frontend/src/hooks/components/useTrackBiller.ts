import type { Biller } from "@/interfaces";
import { handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export function useTrackBiller(billerCopy: Biller, BILLER:any, billerInfo : {id: number, type:  "individual" | "company"}) {
    let UPDATE = undefined
    let isUpdated = false;
    const changed = handleTrackChangedFields(billerCopy, BILLER, false);
    
    if (changed) {
      const { biller_vat_no, biller_tin_number, biller_phone, biller_email } = changed;
      const account_data = {
        ...(biller_vat_no ? { vat_number: biller_vat_no } : {}),
        ...(biller_tin_number ? { tin_number: biller_tin_number } : {}),
      };
 
      UPDATE = {
        ...(biller_phone ? { phone: biller_phone } : {}),
        ...(biller_email ? { email: biller_email } : {}),
        ...(Object.keys(account_data).length > 0 ? { account_data } : {}),
      };
    }

    if(UPDATE){
        const {mutate} = useMutation({
            mutationFn : async() =>{
                const URL  = billerInfo.type === "individual" 
                ? `/api/individuals/${billerInfo.id}/`
                :  `/api/branches/${billerInfo.id}/`

                const response = await api.patch(URL, UPDATE)
                return response.data;
            },
            onSuccess: ()=> isUpdated = true,
            onError: (error) => handleAxiosError("Failed to update biller", error), 
        });
        mutate();
    }
    return isUpdated
}