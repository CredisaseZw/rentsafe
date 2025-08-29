import useMultiTenantInput from "@/hooks/components/useMultipleTenantInput"
import Fieldset from "./Fieldset"
import ColumnsContainer from "./ColumnsContainer"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import type { IndividualMinimal } from "@/interfaces"
import AutoCompleteLandlord from "./AutoCompleteLandlord"
import { Plus, Trash } from "lucide-react"

function MultipleTenantInput() {
    const {tenants, addTenant, removeTenant, updateTenant, updateMobile} = useMultiTenantInput()
    return (
    <div>
        {
            tenants.length &&
            tenants.map((user: IndividualMinimal, index: number)=>(
               <Fieldset legendTitle = {index  === 0 ? "Primary Tenant Details" : "Tenant Details"} key={index}>
                    <div className="relative">
                        <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6">
                            <AutoCompleteLandlord
                                index = {index}
                                searchItem = {user.search_value || ""}
                                multiSetSearchItem  = {updateTenant}
                                landlord_type = {"individual"}
                                landlordIdentifier= {"ID / Passport # (or name)"}
                                
                            />
                            <div className="form-group">
                            <Label className="px-2 font-normal required" htmlFor="tenantName">
                                Tenant Name
                            </Label>
                            <Input
                                disabled
                                value={`${user.first_name} ${user.last_name}`}
                                name="tenantName"
                                id="tenantName"
                                required            
                            />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal" htmlFor="leaseMobileNumber">
                                Lease Mobile Number
                            </Label>
                            <Input
                                value={user.contact_details?.mobile_phone}
                                name="tenant_mobile"
                                id="tenant_mobile"
                                onChange={(e)=> updateMobile(index, e.target.value)}            
                            />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal required" htmlFor="rentGuarantorId">
                                Rent Guarantor ID
                            </Label>
                            <Input
                                name="rentGuarantorId"
                                id="rentGuarantorId"
                                required            
                                
                            />
                            </div>
                            <div className="form-group">
                            <Label className="px-2 font-normal required" htmlFor="rentGuarantorName">
                                Rent Guarantor Name
                            </Label>
                            <Input
                                disabled
                                name="rentGuarantorName"
                                id="rentGuarantorName"
                                required            
                                
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