import Header from "@/components/general/Header"
import { TableBase } from "@/components/general/TableBase"
import AddVATSettingDialog from "@/components/routes/rent-safe/accounting/settings/AddVATSettingDialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableCell, TableRow } from "@/components/ui/table"
import { TAX_OPTIONS_HEADERS } from "@/constants"
import useVATSettings from "@/hooks/components/useVATSettings"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical } from "lucide-react"
import DeleteVATSettingDialogue from "@/components/routes/rent-safe/accounting/settings/DeleteVATSettingDialogue"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"

function VATSettings() {
  const {
    rows,
    error,
    isLoading,
    pagination
  }  =useVATSettings()
  
  return (
    <div>
      <Header title="VAT Settings"/>
      <div className="flex flex-row gap-5">
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
         <div className="main-sm-card w-full flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <h6 className="text-center font-semibold self-center">Tax Options</h6>
            <AddVATSettingDialog/>
          </div>
          <TableBase 
            isError = {Boolean(error)}
            isLoading = {isLoading}
            paginationData={pagination}
            paginationName="page"
            headers={TAX_OPTIONS_HEADERS}>
            {
              rows.map((row, idx:number)=>
                <TableRow key={idx}>
                  <TableCell className="text-center text-sm">{row.description}</TableCell>
                  <TableCell className="text-center text-sm">{row.rate}</TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Popover>
                      <PopoverTrigger>
                        <EllipsisVertical size={18}/>
                      </PopoverTrigger>
                      <PopoverContent>
                        <AddVATSettingDialog
                          vatSetting={row}
                        />
                        <DeleteVATSettingDialogue id={Number(row.id)}/>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            }
            {
              !isLoading &&
              rows.length === 0 &&
              <EmptyTableResponse colSpan={TAX_OPTIONS_HEADERS.length}/>  
            }
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default VATSettings