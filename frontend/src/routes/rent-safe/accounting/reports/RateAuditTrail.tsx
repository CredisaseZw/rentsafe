import Fieldset from "@/components/general/Fieldset"
import Header from "@/components/general/Header"
import { TableBase } from "@/components/general/TableBase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { MONTHS, RATE_AUDIT_TRAIL } from "@/constants";

function RateAuditTrail() {
  return (
    <div>
      <Header title="Rate Audit Trail" variant="danger"/>
      <div className="main-sm-card">
        <div className="w-full flex flex-row items-center justify-center">
          <Fieldset legendTitle="Period Selection" className="w-fit">
            <div className="w-fit flex flex-row justify-between gap-20">
              <div className="flex flex-row items-center gap-5">
                <Input type="radio" name="periodType" defaultChecked={true} />
                <Label>Month</Label>
                <Select >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, idx) => (
                      <SelectItem key={idx} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row items-center gap-5">
                <Input type="radio" name="periodType" />
                <Label>Date</Label>
                <div className="flex gap-2">
                  <div className="form-group">
                    <Label>From</Label>
                    <Input name="dateFrom" type="date" className="w-full" />
                  </div>
                  <div className="form-group">
                    <Label>To</Label>
                    <Input name="dateTo" type="date" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </Fieldset>
        </div>
        <div className="mt-0">
          <TableBase headers={RATE_AUDIT_TRAIL}>
              <TableRow>
                <TableCell colSpan={RATE_AUDIT_TRAIL.length}>
                  <div className="h-[15vh] flex justify-center items-center">
                    <span className="text-sm">Nothing to show</span>
                  </div>
                </TableCell>
            </TableRow>
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default RateAuditTrail