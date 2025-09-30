import { MINIMAL_TENANT_OBJECT } from "@/constants";
import type { BranchFull, IndividualMinimal } from "@/interfaces";
import type { TenantSelection } from "@/types";
import { useEffect, useState } from "react"

export default function useMultiTenantInput(clientType: string){
    const [tenants, setTenants] = useState<TenantSelection[]>([MINIMAL_TENANT_OBJECT])
    const [open, setOpen] = useState(false);
    const [updateIndividual, setUpdateIndividual] = useState<TenantSelection | null>(null)

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
                        mobile_number: selectedTenant?.phone ?? "",
                        store_mobile: selectedTenant?.phone ?? "",
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
                    identification_number : selectedTenant.branch_name,
                    mobile_number:selectedTenant?.phone ?? ""
                }   
                : tenant
            )
        );
    }

    function checkMobileNumberUpdate(user: TenantSelection) {
        if (user.mobile_number !== user.store_mobile && user.id > 0) {
            setUpdateIndividual(user);
            setOpen(true);
        }
    }

    return{
        tenants,
        open, 
        updateIndividual,
        setOpen,
        onSelectTenant,
        updateTenant,
        updateMobile,
        setTenants,
        addTenant,
        setUpdateIndividual,
        removeTenant,
        checkMobileNumberUpdate
    }
}
