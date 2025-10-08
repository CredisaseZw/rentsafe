import Button from "@/components/general/Button"
import Header from "@/components/general/Header"
import { TableBase } from "@/components/general/TableBase"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableCell, TableRow } from "@/components/ui/table"
import { TAX_OPTIONS_HEADERS } from "@/constants"
import useVATSettings from "@/hooks/components/useVATSettings"
import { validateAmounts } from "@/lib/utils"
import { Plus, Save, X } from "lucide-react"

function VATSettings() {
  const {
    rows,
    updateRow,
    removeRow,
    addRow,
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
                <Checkbox/>
                <Label className="text-sm">VAT Register</Label>
              </div>
              <div className="form-group">
                <Label className="text-sm">VAT Registration Number</Label>
                <Input
                  name="vatRegistrationNumber"
                />
              </div>
            </form>
          </div>
        </div>
         <div className="main-sm-card w-full flex flex-col gap-5">
          <h6 className="text-center font-semibold">Tax Options</h6>
          <TableBase headers={TAX_OPTIONS_HEADERS}>
            {
              rows.map((row, idx:number)=>
                <TableRow key={idx}>
                  <TableCell>
                    <Input
                      placeholder="description"
                      value={row.description}
                      onChange={(e)=>updateRow(idx, "description", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Rate"
                      onChange={(e)=>updateRow(idx, "rate", e.target.value)}
                      type= "number"
                      step={0.01}
                      value={row.rate}
                      onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                      onKeyDown={validateAmounts}
                    />
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Button variant={"ghost"} onClick={()=>removeRow(idx)}>
                      <X className="text-red-600"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            }
          </TableBase>
          <div className="flex gap-5 flex-row justify-end">
            <Button asChild variant="outline" onClick={addRow}>
              <Plus size={15}/>
              Add Tax Item
            </Button>
            <Button asChild>
              <Save size={15} />
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VATSettings