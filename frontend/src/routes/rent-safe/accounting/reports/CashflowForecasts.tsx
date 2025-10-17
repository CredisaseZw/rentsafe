import Header from "@/components/general/Header"
import { TableBase } from "@/components/general/TableBase"
import { TableCell, TableRow } from "@/components/ui/table"
import { CASHFLOW_FORECAST } from "@/constants"

function CashflowForecasts() {
  return (
    <div>
      <Header title = "Cashflow Forecast (USD)"/>
      <div className="main-sm-card">
        <TableBase headers={CASHFLOW_FORECAST}>
          <TableRow>
            <TableCell className="bg-green-600 text-white font-bold text-center" colSpan={CASHFLOW_FORECAST.length}>
              Inflows
            </TableCell>
          </TableRow>
          <>
            <TableRow>
              <TableCell colSpan={CASHFLOW_FORECAST.length}>
                <div className="h-[15vh] flex justify-center items-center">
                  <span className="text-sm">Nothing to show</span>
                </div>
              </TableCell>
            </TableRow>
          </>
          <TableRow>
            <TableCell className="text-sm text-center border-r border-color">Totals</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center">$0.00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={CASHFLOW_FORECAST.length}></TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell className="bg-red-600 text-white font-bold text-center" colSpan={CASHFLOW_FORECAST.length}>
              Outflows
            </TableCell>
          </TableRow>
          <>
            <TableRow>
              <TableCell colSpan={CASHFLOW_FORECAST.length}>
                <div className="h-[15vh] flex justify-center items-center">
                  <span className="text-sm">Nothing to show</span>
                </div>
              </TableCell>
            </TableRow>
          </>
          <TableRow>
            <TableCell className="text-sm text-center border-r border-color">Totals</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center border-r border-color">$0.00</TableCell>
            <TableCell className="text-sm text-center">$0.00</TableCell>
          </TableRow>
          
        </TableBase>
      </div>
    </div>
  )
}

export default CashflowForecasts