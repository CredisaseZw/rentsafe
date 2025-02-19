import Layout from '../../../components/Layouts/client/Layout.jsx';
import useForecasts from '../../../hooks/page-hooks/useForecasts.js';
import { fmtAmount } from '../../../utils/index.js';

export default function Forecasts({
  forecast_inflows: inflows_statement = [],
  forecast_outflows: outflows_statement = [],
  Auth: {
    company: { company_name },
  },
}) {
  const { netFlows, inflows_totals, outflows_totals } = useForecasts(
    inflows_statement,
    outflows_statement
  );

  console.log(inflows_statement);
  return (
    <div className="bg-white border rounded-3">
      <h5 className="text-center p-2 mb-0 text-white bg-info">
        {company_name}
      </h5>

      <div className="custom-bg-grey-2 text-white text-center p-1">
        Cashflow Forecast (USD)
      </div>

      <table
        style={{ lineHeight: '5px', fontSize: '12px' }}
        className="table table-bordered table-responsive mb-0"
      >
        <thead className="position-sticky c-table-top bg-white shadow-sm">
          <tr>
            <th>Customer</th>
            <th>0-7 Days</th>
            <th>8-14 Days</th>
            <th>15-21 Days</th>
            <th>21+ Days</th>
            <th>total</th>
          </tr>
        </thead>

        <tbody>
          <>
            <tr>
              <td className="fs-larger bg-success text-white fw-bolder">
                inflows
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            {inflows_statement?.map((row, index) => (
              <tr key={index}>
                <td>{row.tenant}</td>
                <td className="text-end">{fmtAmount(row['0-7'])}</td>
                <td className="text-end">{fmtAmount(row['8-14'])}</td>
                <td className="text-end">{fmtAmount(row['14-21'])}</td>
                <td className="text-end">{fmtAmount(row['21+'])}</td>
                <td className="text-end">${fmtAmount(row.total)}</td>
              </tr>
            ))}

            {!Boolean(inflows_statement?.length) && (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-1 d-flex justify-content-center align-items-center ">
                    Nothing to show
                  </div>
                </td>
              </tr>
            )}

            {inflows_totals && (
              <tr>
                <th className="fs-larger">Total</th>
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

                <th className="c-border-y-dark text-end">
                  ${fmtAmount(inflows_totals.total)}
                </th>
              </tr>
            )}
          </>

          <tr className="py-3 d-block"></tr>

          <>
            <tr>
              <td className="fs-larger bg-danger text-white fw-bolder">
                outflows
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            {outflows_statement?.map((row, index) => (
              <tr key={index}>
                <td>{row.tenant}</td>
                <td className="text-end">({fmtAmount(row['0-7'])})</td>
                <td className="text-end">({fmtAmount(row['8-14'])})</td>
                <td className="text-end">({fmtAmount(row['14-21'])})</td>
                <td className="text-end">({fmtAmount(row['21+'])})</td>
                <td className="text-end">(${fmtAmount(row.total)})</td>
              </tr>
            ))}

            {!Boolean(outflows_statement?.length) && (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-1 d-flex justify-content-center align-items-center ">
                    Nothing to show
                  </div>
                </td>
              </tr>
            )}

            {outflows_totals && (
              <tr>
                <th className="fs-larger">Total</th>
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

                <th className="c-border-y-dark text-end">
                  ( ${fmtAmount(outflows_totals.total)})
                </th>
              </tr>
            )}
          </>

          <tr className="py-3 d-block"></tr>

          {netFlows && (
            <tr>
              <th className="fs-larger">Net Flows</th>
              <th className="text-end c-border-y-dark">
                {fmtAmount(netFlows.zero_to_seven_days)}
              </th>

              <th className="text-end c-border-y-dark">
                {fmtAmount(netFlows.eight_to_fourteen_days)}
              </th>

              <th className="text-end c-border-y-dark">
                {fmtAmount(netFlows.fifteen_to_twenty_one_days)}
              </th>

              <th className="text-end c-border-y-dark">
                {fmtAmount(netFlows.twenty_one_plus_days)}
              </th>

              <th className="text-end c-border-y-dark">
                ${fmtAmount(netFlows.total)}
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

Forecasts.layout = (page) => <Layout children={page} title={'forecasts'} />;
