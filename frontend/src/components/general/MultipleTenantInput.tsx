import useMultiTenantInput from "@/hooks/components/useMultipleTenantInput"
import Fieldset from "./Fieldset"
import ColumnsContainer from "./ColumnsContainer"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Plus, Trash } from "lucide-react"
import AutoCompleteClient from "./AutoCompleteClient"
import type { Tenant, TenantSelection } from "@/types"
import { Checkbox } from "../ui/checkbox"
import type { Address } from "@/interfaces"
import UpdateMobileNumber from "../routes/rent-safe/tenant-leases/UpdateMobileNumber"
import { useEffect } from "react"


interface props {
    existingTenants?: Tenant[],
    clientType: string,
    setPrimaryTenantAddress: React.Dispatch<React.SetStateAction<Address | undefined>>
}
function MultipleTenantInput({clientType, setPrimaryTenantAddress, existingTenants}:props) {
    const {
        open,
        tenants,
        updateIndividual, 
        checkMobileNumberUpdate, 
        setUpdateIndividual,
        onSelectTenant,
        removeTenant,
        updateTenant, 
        updateMobile,
        setTenants,
        addTenant, 
        setOpen,
        } = useMultiTenantInput(clientType)
    
        useEffect(() => {
            if (!existingTenants || existingTenants.length === 0) return;
            setTenants([])
            existingTenants.forEach(t => {
                setTenants(prev => [
                    ...prev,
                    {
                    search_value : `${t.tenant_object.full_name} - ${t.tenant_object.identification_number  ?? t.tenant_object.company_name ?? ""}`,
                    id: t.tenant_object.id ?? 0,
                    full_name: t.tenant_object.full_name ?? "",
                    identification_number: t.tenant_object.identification_number ?? t.tenant_object.company_name ?? "",
                    mobile_number:  "",
                    address: null,
                    is_primary: false,
                    },
                ]);
            });
        }, [existingTenants]);

    
    return (
    <div>
        {
            tenants.length &&
            tenants.map((user: TenantSelection, index: number)=>(
               <Fieldset legendTitle = {index  === 0 ? "Primary Tenant Details" : "Tenant Details"} key={index}>
                    <div className="relative">
                        <Input
                            type="hidden"
                            name={`tenants[${index}]`}
                            value={user.id || ""}
                        />
                        <ColumnsContainer numberOfCols={4} marginClass="mt-0" gapClass="gap-6">
                            <AutoCompleteClient
                                index = {index}
                                isRequired = {false}
                                searchItem = {user.search_value || ""}
                                createClient = {true}
                                multiSetSearchItem  = {updateTenant}
                                setPrimaryTenantAddress = {setPrimaryTenantAddress}
                                clientType = {clientType}
                                clientLabel= { clientType === "individual" ? 
                                    "ID / Passport # (or name)" :
                                    "Registration Name / Number"
                                }
                                onSelectValue={onSelectTenant}
                            />
                            <div className="form-group mt-1">
                                <Label className="px-2 font-normal required" htmlFor="tenantName">
                                    {
                                        clientType === "individual" ? "Tenant Name" : "Company Name"
                                    }
                                </Label>
                                <Input
                                    disabled
                                    value={`${user.full_name}`}
                                    name = {`tenantName[${index}]`}
                                    id="tenantName"
                                    required            
                                />
                            </div>
                            <div className="form-group mt-1">
                            <Label className="px-2 font-normal" htmlFor="leaseMobileNumber">
                                Tenant Mobile Number
                            </Label>
                                <Input
                                    value={user.mobile_number}
                                    name={`tenantMobile[${index}]`}
                                    id="tenantMobile"
                                    onChange={(e)=> updateMobile(index, e.target.value)}        
                                    onBlur={()=>{if(clientType === "individual") checkMobileNumberUpdate(user)}}    
                                />
                            </div>
                            {
                                index === 0 &&
                                <div className="flex mt-1 flex-row gap-2 items-center justify-center">
                                    <Checkbox
                                        className="self-center"
                                        name={`isPrimary[${index}]`}
                                        id={`isPrimary${index}`}
                                        checked = {index === 0}
                                    />
                                    <Label className="px-2 font-normal self-center" htmlFor={`rentVariable-${index}`}>
                                        Is primary
                                    </Label>
                                </div>
                            }
                        </ColumnsContainer>
                        {
                            index !== 0 &&
                            <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform">
                                <Button
                                    className="rounded-full"
                                    variant="DANGER"
                                    size="icon"
                                    type="button"
                                    onClick={() => removeTenant(index)}
                                >
                                    <Trash />
                                </Button>
                        </div>
                        }
                    </div>
                </Fieldset>
            ))
        }
        {
            clientType === "individual" &&
            <UpdateMobileNumber
                updateIndividual ={updateIndividual}
                open = {open}
                setUpdateIndividual = {setUpdateIndividual}
                setOpen = {setOpen}
            />
        }
        <Button variant={"outline"} type="button" onClick={addTenant}>
            Add tenant <Plus/>
        </Button>
        
    </div>
  )
}

export default MultipleTenantInput