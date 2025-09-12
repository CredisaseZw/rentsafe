import { MINIMAL_TENANT_OBJECT } from "@/constants";
import type { BranchFull, IndividualMinimal, IndividualTenantContact } from "@/interfaces";
import { extractTenantBranchContact } from "@/lib/utils";
import type { TenantSelection } from "@/types";
import { useEffect, useState } from "react"

export default function useMultiTenantInput(clientType: string){
    const [tenants, setTenants] = useState<TenantSelection[]>([MINIMAL_TENANT_OBJECT])

    useEffect(()=>{
        setTenants([MINIMAL_TENANT_OBJECT])
    }, [clientType])
    
    const addTenant = () => setTenants((p)=>[...p, MINIMAL_TENANT_OBJECT])
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
                    mobile_number: value,
                }
                : tenant
            )
        );
    };

   const onSelectTenant = (selectedTenant: IndividualMinimal | BranchFull, index :number | undefined) =>{

    if ("first_name" in selectedTenant){
        setTenants((prev) =>
            prev.map((tenant, i) =>
                i === index
                    ? {
                        ...tenant,
                        id : selectedTenant.id,
                        full_name : `${selectedTenant.first_name} ${selectedTenant.last_name}`,
                        identification_number : selectedTenant.identification_number,
                        mobile_number: Array.isArray(selectedTenant.contact_details?.mobile_phone)
                        ? selectedTenant.contact_details?.mobile_phone?.[0] ?? ""
                        : (selectedTenant.contact_details?.mobile_phone as IndividualTenantContact)?.mobile_phone ?? "",
                        address : selectedTenant.primary_address ?? null
                    }   
                    : tenant
                )
        );
        return
    }
    setTenants((prev) =>
        prev.map((tenant, i) =>
            i === index
                ? {
                    ...tenant,
                    id : selectedTenant.id,
                    full_name : selectedTenant.branch_name,
                    identification_number : selectedTenant.company.registration_number,
                    mobile_number: extractTenantBranchContact(selectedTenant.contacts)
                }   
                : tenant
            )
        );
    }

    return{
        tenants,
        onSelectTenant,
        updateTenant,
        updateMobile,
        addTenant,
        removeTenant
    }
}
