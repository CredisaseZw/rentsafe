import { MINIMAL_INDIVIDUAL_OBJECT } from "@/constants";
import type { IndividualMinimal } from "@/interfaces";
import { useState } from "react"

export default function useMultiTenantInput(){
    const [tenants, setTenants] = useState<IndividualMinimal[]>([MINIMAL_INDIVIDUAL_OBJECT])
    const addTenant = () => setTenants((p)=>[...p, MINIMAL_INDIVIDUAL_OBJECT])

    const removeTenant = (index: number) => setTenants(p => p.filter((_, i) => i !== index));

    const updateTenant = (index: number, key: string, value: any) => {
        setTenants((prev) =>
        prev.map((tenant, i) =>
            i === index
            ? { ...tenant, [key]: value }
            : tenant
        )
        );
    };  

    const updateMobile = (index: number, value: any) => {
        setTenants((prev) =>
            prev.map((tenant, i) =>
            i === index
                ? {
                    ...tenant,
                    contact_details: {
                    ...(tenant.contact_details ?? {}),
                    mobile_phone: value,
                    },
                }
                : tenant
            )
        );
    };

    return{
        tenants,
        updateTenant,
        updateMobile,
        addTenant,
        removeTenant
    }
}
