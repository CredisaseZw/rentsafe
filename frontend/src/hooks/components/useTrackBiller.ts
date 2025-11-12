import type { Biller } from "@/interfaces";
import { handleTrackChangedFields } from "@/lib/utils";

export function useTrackBiller(
    billerCopy: Biller,
    BILLER:any,
  ) {
    let UPDATE = undefined
    if (!billerCopy) return {UPDATE}
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
    
    return {
      UPDATE, 
    }
}