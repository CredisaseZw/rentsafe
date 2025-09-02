import useMultiTenantInput from "@/hooks/components/useMultipleTenantInput"
import Fieldset from "./Fieldset"
import ColumnsContainer from "./ColumnsContainer"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Plus, Trash } from "lucide-react"
import AutoCompleteClient from "./AutoCompleteClient"
import type { TenantSelection } from "@/types"
import { Checkbox } from "../ui/checkbox"

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
                        <Input
                            type="hidden"
                            name={`tenants[${index}]`}
                            value={user.id || ""}
                        />
                        <ColumnsContainer numberOfCols={4} marginClass="mt-0" gapClass="gap-6">
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
                            <div className="form-group mt-1">
                                <Label className="px-2 font-normal required" htmlFor="tenantName">
                                    {
                                        clientType === "individual" ? "Tenant Name" : "Branch Name"
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
                                />
                            </div>
                            <div className="flex mt-1 flex-row gap-2 items-center justify-center">
                                <Checkbox
                                    className="self-center"
                                    name={`isPrimary[${index}]`}
                                    id={`isPrimary${index}`}
                                    defaultChecked = {index === 0}

                                />
                                <Label className="px-2 font-normal self-center" htmlFor={`rentVariable-${index}`}>
                                    Is primary
                                </Label>
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