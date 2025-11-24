import type { Biller } from "@/interfaces";
import { handleTrackChangedFields } from "@/lib/utils";

export function useTrackBiller(
  billerCopy: Biller,
  BILLER: any,
  type: "tenant" | "individual" | "company"
) {
  let UPDATE: any = undefined;

  if (!billerCopy) return { UPDATE };

  const changed = handleTrackChangedFields(billerCopy, BILLER, false);
  if (!changed || Object.keys(changed).length === 0) {
    return { UPDATE };
  }

  const { biller_vat_no, biller_tin_number, biller_phone, biller_email } = changed;
  if (type === "company") {
    UPDATE = {
      profile: {
        ...(biller_phone && { phone: biller_phone }),
        ...(biller_email && { email: biller_email }),
        ...(biller_vat_no && { vat_number: biller_vat_no }),
        ...(biller_tin_number && { tin_number: biller_tin_number }),
      },
    };
    if (Object.keys(UPDATE.profile).length === 0 ) return {UPDATE: undefined}
    return { UPDATE };
  }

  const account_data = {
    ...(biller_vat_no && { vat_number: biller_vat_no }),
    ...(biller_tin_number && { tin_number: biller_tin_number }),
  };

  UPDATE = {
    ...(biller_phone && { phone: biller_phone }),
    ...(biller_email && { email: biller_email }),
    ...(Object.keys(account_data).length > 0 ? { account_data } : {}),
  };

  return { UPDATE };
}
