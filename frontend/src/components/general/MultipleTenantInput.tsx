import useMultiTenantInput from "@/hooks/components/useMultipleTenantInput"
import Fieldset from "./Fieldset"
import ColumnsContainer from "./ColumnsContainer"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Plus, Trash } from "lucide-react"
import AutoCompleteClient from "./AutoCompleteClient"
import type { TenantSelection } from "@/types"

interface props {
    clientType : string
}
function MultipleTenantInput({clientType}:props) {
    const {tenants, addTenant, removeTenant, updateTenant, updateMobile, onSelectTenant} = useMultiTenantInput()
    return (
    <div>
        {
            tenants.length &&
            tenants.map((user: TenantSelection, index: number)=>(
               <Fieldset legendTitle = {index  === 0 ? "Primary Tenant Details" : "Tenant Details"} key={index}>
                    <div className="relative">
                        <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6">
                            <AutoCompleteClient
                                index = {index}
                                searchItem = {user.search_value || ""}
                                multiSetSearchItem  = {updateTenant}
                                clientType = {clientType}
                                clientLabel= { clientType === "individual" ? 
                                    "ID / Passport # (or name)" :
                                    "Account Number (or name)"
                                }
                                onSelectValue={onSelectTenant}
                            />
                            <div className="form-group">
                                <Label className="px-2 font-normal required" htmlFor="tenantName">
                                    {
                                        clientType === "individual" ? "Tenant Name" : "Branch Name"
                                    }
                                </Label>
                                <Input
                                    disabled
                                    value={`${user.full_name}`}
                                    name="tenantName"
                                    id="tenantName"
                                    required            
                                />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal" htmlFor="leaseMobileNumber">
                                Tenant Mobile Number
                            </Label>
                            <Input
                                value={user.mobile_number}
                                name="tenant_mobile"
                                id="tenant_mobile"
                                onChange={(e)=> updateMobile(index, e.target.value)}            
                            />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal" htmlFor="rentGuarantorId">
                                Rent Guarantor ID
                            </Label>
                            <Input
                                name="rentGuarantorId"
                                id="rentGuarantorId"        
                            />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal" htmlFor="rentGuarantorName">
                                Rent Guarantor Name
                            </Label>
                            <Input
                                disabled
                                name="rentGuarantorName"
                                id="rentGuarantorName"
                                        
                                
                            />
                            </div>
                        </ColumnsContainer>
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
                    </div>
                    
                </Fieldset>
            ))
        }
        <Button variant={"outline"} type="button" onClick={addTenant}>
            Add tenant <Plus/>
        </Button>
    </div>
  )
}

export default MultipleTenantInput