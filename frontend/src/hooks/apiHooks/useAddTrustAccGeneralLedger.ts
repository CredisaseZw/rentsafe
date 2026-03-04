import { api } from "@/api/axios";
import type { Payload } from "@/types"
import { useMutation } from "@tanstack/react-query"

export interface AddTrustAccGeneralLedgerData {
    account_name: string;
    account_type_id: number;
    is_contra_account: boolean;
}
export interface AddTrustAccGeneralLedgerPayload extends Payload{
    data : AddTrustAccGeneralLedgerData
}

function useAddTrustAccGeneralLedger() {
    const { mutate } = useMutation({
        mutationFn : async(payload: AddTrustAccGeneralLedgerPayload)=>{
            const response = payload.mode === "create"
            ? api.post("/api/trust-accounting/general-ledgers/", payload.data)
            : api.patch(`/api/trust-accounting/general-ledgers/${payload.id}/`, payload.data)
            return (await response).data
        }
    })
    return {
        mutate
    }
}

export default useAddTrustAccGeneralLedger