import DeleteDialogue from "@/components/general/DeleteDialogue"
import Header from "@/components/general/Header"
import OptionsWrapper from "@/components/general/OptionsWrapper"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddTrustAccVATSettingDialogue from "@/components/routes/rent-safe/trust-accounting/vat-settings/AddTrustAccVATSettingDialogue"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, TRUST_ACC_VAT_SETTINGS_HEADERS } from "@/constants"
import useOptimisticCacheUpdate from "@/hooks/components/useOptimisticCacheUpdate"
import useTrustAccVatSettings from "@/hooks/components/useTrustAccVatSettings"
import { handleDeletion } from "@/lib/utils"
import { Trash } from "lucide-react"

function TrustAccountVatSettings() {
    const { 
        isError,
        isLoading,
        vatSettings,
        pagination
    } = useTrustAccVatSettings();
    const {updateCache} = useOptimisticCacheUpdate()
  return (
    <div>   
        <Header title="Trust Account V.A.T Settings" variant="success"/>
        <div className="flex md:flex-row flex-col gap-5">
            <div className="main-sm-card w-1/4">
                <h6 className="text-center font-semibold">Registration</h6>
                <div className="mt-5">
                    <form className="flex flex-col gap-5">
                    <div className="flex flex-row gap-3">
                        <Checkbox disabled/>
                        <Label className="text-sm text-muted">VAT Register</Label>
                    </div>
                    <div className="form-group">
                        <Label className="text-sm">VAT Registration Number</Label>
                        <Input
                        disabled
                        name="vatRegistrationNumber"
                        />
                    </div>
                    </form>
                </div>
            </div>
            <div className="main-card mt-0">
                <div className="flex md:flex-row flex-col md:justify-between gap-4">
                    <SectionHeader
                        title="Trust Acc V.A.T Settings"
                        subTotal={vatSettings.length}
                        total={pagination?.count ?? 0}
                    />
                    <AddTrustAccVATSettingDialogue/>
                </div>
                <br />
                <TableBase
                    paginationData={pagination}
                    isEmpty = {vatSettings.length === 0}
                    isLoading = {isLoading}
                    isError = {isError}
                    headers={TRUST_ACC_VAT_SETTINGS_HEADERS}
                >   
                    {
                        vatSettings.map((item)=>(
                            <TableRow key={item.id}>
                                <TableCell className="text-center">{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell className="max-w-[200px]">
                                    <p className="truncate">
                                        {item.description}
                                    </p>
                                </TableCell>                                
                                <TableCell className="text-center">{item.rate}%</TableCell>
                                <TableCell>
                                    <OptionsWrapper>
                                        <AddTrustAccVATSettingDialogue vatSetting={item}/>
                                        <DeleteDialogue
                                            trigger = {
                                                <div className="flex flex-row gap-3 text-red-600">
                                                    <Trash size={15} className="self-center"/>
                                                    Delete
                                                </div>
                                            }
                                            mutationFunc={()=>handleDeletion(DELETION_LINKS.TRUST_ACC_VAT_SETTING, Number(item.id))}
                                            value="VAT Setting"
                                            keyStore={()=> updateCache({
                                                key : ["trust-acc-vat-settings"],
                                                id : item.id,
                                                mode : "deletion"
                                            })}
                                        />
                                    </OptionsWrapper>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBase>
            </div>
        </div>
    </div>
  )
}

export default TrustAccountVatSettings