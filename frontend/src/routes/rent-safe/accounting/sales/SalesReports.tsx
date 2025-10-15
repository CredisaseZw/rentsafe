import ColumnsContainer from "@/components/general/ColumnsContainer";
import Fieldset from "@/components/general/Fieldset";
import LoadingIndicator from "@/components/general/LoadingIndicator";
import Pill from "@/components/general/Pill";
import { TableBase } from "@/components/general/TableBase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { MONTHS, SALES_REPORTS_HEADERS } from "@/constants";
import useSalesReports from "@/hooks/components/useSalesReports";

export default function SalesReports() {
  const {
    currencyLoading,
    currencies,
    currency
  } = useSalesReports()

  return (
    <div >
      <div className="main-sm-card">
        <ColumnsContainer marginClass="mt-0" numberOfCols={2} gapClass="gap-4">
          <ColumnsContainer numberOfCols={2} gapClass="gap-4" marginClass="mt-0">
            <Fieldset legendTitle="Category">
              <ColumnsContainer numberOfCols={2} marginClass="mt-0" gapClass="gap-4">
                <div className="form-group flex-1">
                  <Label>From</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bureau">Bureau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group flex-1">
                  <Label>To</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bureau">Bureau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </ColumnsContainer>
            </Fieldset>
            <Fieldset legendTitle="Currency">
              <div className="w-full h-full flex">
                <Select key={currency?.id}  name="currency" required defaultValue={String(currency?.id)}>
                  <SelectTrigger className="w-full self-center">
                      <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                      {
                        currencies.map((c)=>
                        <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>)
                      }
                      { 
                        currencies.length === 0 &&
                        currencyLoading &&
                        <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                            <LoadingIndicator />
                        </SelectItem>
                      }
                  </SelectContent>
              </Select>
              </div>            
            </Fieldset>
          </ColumnsContainer>
          <Fieldset legendTitle="Period Selection">
            <div className="w-full flex flex-row justify-evenly gap-4">
              <div className="flex flex-row items-center gap-5">
                <Input type="radio" name="periodType" defaultChecked={true} />
                <Label>Month</Label>
                <Select >
                  <SelectTrigger className="w-full">
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
        </ColumnsContainer>        
      </div>

      <div className="main-card">
        <TableBase headers={SALES_REPORTS_HEADERS}>
            <>
              <TableRow>
                <TableCell colSpan={SALES_REPORTS_HEADERS.length}>
                  <Pill variant={"primary"} className="ml-17">USD</Pill>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-center">B1005</TableCell>
                <TableCell className="text-center">GIlbert </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-r border-color text-end" colSpan={2}>Total Sales(USD)</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
              </TableRow>
             
            </>
            <>
              <TableRow>
                <TableCell colSpan={SALES_REPORTS_HEADERS.length}>
                  <Pill variant={"primary"} className="ml-17">USD</Pill>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-center">B1005</TableCell>
                <TableCell className="text-center">GIlbert </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-r border-color text-end" colSpan={2}>Total Sales(USD)</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
              </TableRow>
             
            </>
            <>
              <TableRow>
                <TableCell colSpan={SALES_REPORTS_HEADERS.length}>
                  <Pill variant={"primary"} className="ml-17">USD</Pill>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-center">B1005</TableCell>
                <TableCell className="text-center">GIlbert </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-r border-color text-end" colSpan={2}>Total Sales(USD)</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
                <TableCell className="text-center border-r border-color">0.00</TableCell>
              </TableRow>
            </>
      
        </TableBase>
      </div>
    </div>
  )
}
