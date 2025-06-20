import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useForecasts from "../../../hooks/page-hooks/useForecasts.js";
import { fmtAmount } from "../../../utils/index.js";

export default function Forecasts({
  forecast_inflows: inflows_statement = [],
  forecast_outflows: outflows_statement = [],
  Auth,
}) {
  const { netFlows, inflows_totals, outflows_totals } = useForecasts(
    inflows_statement,
    outflows_statement
  );

  return (
    <CustomTable.Table
      tabletitle={Auth?.company?.company_name || "Cashflow Forecasts"}
      tabletitleBg="info"
      tabletitleColor="white"
    >
      <CustomTable.ColGroup ratios={[null, null, null, null, null, null]} />

      <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
        <tr>
          <td colSpan={6} className="c-p-0">
            <div className="custom-bg-grey-2 text-white text-center p-1">
              <small>Cashflow Forecast (USD)</small>
            </div>
          </td>
        </tr>

        <tr>
          <th>Customer</th>
          <th className="text-end">0-7 Days</th>
          <th className="text-end">8-14 Days</th>
          <th className="text-end">15-21 Days</th>
          <th className="text-end">21+ Days</th>
          <th className="text-end">total</th>
        </tr>
      </thead>

      <tbody>
        <>
          <tr>
            <td className="bg-success text-white">inflows</td>
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>

          {inflows_statement?.map((row, index) => (
            <tr key={index}>
              <td>{row.tenant}</td>
              <td className="text-end">{fmtAmount(row["0-7"])}</td>
              <td className="text-end">{fmtAmount(row["8-14"])}</td>
              <td className="text-end">{fmtAmount(row["14-21"])}</td>
              <td className="text-end">{fmtAmount(row["21+"])}</td>
              <td className="text-end">${fmtAmount(row.total)}</td>
            </tr>
          ))}

          {!Boolean(inflows_statement?.length) && <CustomTable.NothingToShow colSpan={6} />}

          {inflows_totals && (
            <tr>
              <th>Total</th>
              <th className="c-border-y-dark text-end">
                {fmtAmount(inflows_totals.zero_to_seven_days)}
              </th>

              <th className="c-border-y-dark text-end">
                {fmtAmount(inflows_totals.eight_to_fourteen_days)}
              </th>

              <th className="c-border-y-dark text-end">
                {fmtAmount(inflows_totals.fifteen_to_twenty_one_days)}
              </th>

              <th className="c-border-y-dark text-end">
                {fmtAmount(inflows_totals.twenty_one_plus_days)}
              </th>

              <th className="c-border-y-dark text-end">${fmtAmount(inflows_totals.total)}</th>
            </tr>
          )}
        </>

        <tr className="py-3 d-block"></tr>

        <>
          <tr>
            <td className="bg-danger text-white">outflows</td>
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>

          {outflows_statement?.map((row, index) => (
            <tr key={index}>
              <td>{row.tenant}</td>
              <td className="text-end">({fmtAmount(row["0-7"])})</td>
              <td className="text-end">({fmtAmount(row["8-14"])})</td>
              <td className="text-end">({fmtAmount(row["14-21"])})</td>
              <td className="text-end">({fmtAmount(row["21+"])})</td>
              <td className="text-end">(${fmtAmount(row.total)})</td>
            </tr>
          ))}

          {!Boolean(outflows_statement?.length) && <CustomTable.NothingToShow colSpan={6} />}

          {outflows_totals && (
            <tr>
              <th>Total</th>
              <th className="c-border-y-dark text-end">
                ( {fmtAmount(outflows_totals.zero_to_seven_days)})
              </th>

              <th className="c-border-y-dark text-end">
                ( {fmtAmount(outflows_totals.eight_to_fourteen_days)})
              </th>

              <th className="c-border-y-dark text-end">
                ( {fmtAmount(outflows_totals.fifteen_to_twenty_one_days)})
              </th>

              <th className="c-border-y-dark text-end">
                ( {fmtAmount(outflows_totals.twenty_one_plus_days)})
              </th>

              <th className="c-border-y-dark text-end">( ${fmtAmount(outflows_totals.total)})</th>
            </tr>
          )}
        </>
      </tbody>

      {netFlows && (
        <tfoot>
          <tr>
            <th>Net Flows</th>
            <th className="text-end c-border-y-dark">{fmtAmount(netFlows.zero_to_seven_days)}</th>

            <th className="text-end c-border-y-dark">
              {fmtAmount(netFlows.eight_to_fourteen_days)}
            </th>

            <th className="text-end c-border-y-dark">
              {fmtAmount(netFlows.fifteen_to_twenty_one_days)}
            </th>

            <th className="text-end c-border-y-dark">{fmtAmount(netFlows.twenty_one_plus_days)}</th>

            <th className="text-end c-border-y-dark">${fmtAmount(netFlows.total)}</th>
          </tr>
        </tfoot>
      )}
    </CustomTable.Table>
  );
}

Forecasts.layout = (page) => <Layout children={page} title={"Forecasts"} />;
