import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useInvoicing from "../../../hooks/page-hooks/useInvoicing.js";
import DismissInvoice from "../../../components/modals/Client/DismissInvoice.jsx";
import { formatCurrency } from "../../../utils/formatting.js";

export default function Invoicing(props) {
  const {
    today,
    pastDue,
    usdState,
    zwlState,
    isLoading,
    headerDate,
    usdBatchTotal,
    zwlBatchTotal,
    invoiceToDismiss,
    submitData,
    usdDispatch,
    zwlDispatch,
    confirmDismissal,
    setInvoiceToDismiss,
  } = useInvoicing(props);

  return (
    <div>
      {Boolean(invoiceToDismiss) && (
        <DismissInvoice
          show
          invoice={invoiceToDismiss}
          confirmDismissal={confirmDismissal}
          handleClose={() => setInvoiceToDismiss(null)}
        />
      )}

      <CustomTable.Table
        tabletitle={"Rental Invoicing - " + headerDate}
        tabletitleColor="white"
        tabletitleBg="info"
      >
        <CustomTable.ColGroup
          ratios={pastDue ? [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] : [1, 1, 1, 1, 1, 1, 1, 1, 1]}
        />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            {pastDue && <th />}
            <th>Inv. Date</th>
            <th>Tenant Name</th>
            <th>Tenant Acc. No.</th>
            <th>Inv. No.</th>
            <th>Currency</th>
            <th>Base Rental</th>
            <th>Operating Costs</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={pastDue ? 10 : 9} className="border-0">
              <div className="p-1 fw-bold">USD</div>
            </td>
          </tr>

          {usdState.map((invoice) => (
            <tr key={invoice.id}>
              {pastDue && (
                <td>
                  <i
                    title="invoice is past payment period"
                    className="material-icons custom-cursor-pointer custom-icon-small text-danger d-block p-0 m-0"
                  >
                    timer
                  </i>
                </td>
              )}

              <td>
                <input
                  type="date"
                  max={today.toISOString().split("T")[0]}
                  min={
                    today.getDate() >= invoice.payment_period_start
                      ? today.toISOString().split("T")[0]
                      : today.getMonth() === 0
                        ? new Date(today.getFullYear() - 1, 11, 26).toISOString().split("T")[0]
                        : new Date(today.getFullYear(), today.getMonth() - 1, 26)
                            .toISOString()
                            .split("T")[0]
                  }
                  className="form-control form-control-sm"
                  value={invoice.invoice_date}
                  onChange={(e) =>
                    usdDispatch({
                      type: "updateInvDate",
                      id: invoice.id,
                      invoice_date: e.target.value,
                    })
                  }
                />
              </td>

              <td>{invoice.tenant_name}</td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.tenant_acc_no}
                  onChange={(e) =>
                    usdDispatch({
                      type: "updateTenantAccNumber",
                      id: invoice.id,
                      tenant_acc_no: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.invoice_no}
                  onChange={(e) =>
                    usdDispatch({
                      type: "updateInvNumber",
                      id: invoice.id,
                      invoice_no: e.target.value,
                    })
                  }
                />
              </td>

              <td className="text-nowrap">{invoice.lease_currency_type}</td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.owing_amount}
                  onChange={(e) =>
                    usdDispatch({
                      type: "updateBaseRental",
                      id: invoice.id,
                      owing_amount: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.operationalCosts}
                  onChange={(e) =>
                    usdDispatch({
                      type: "updateOperatingCosts",
                      id: invoice.id,
                      operationalCosts: e.target.value,
                    })
                  }
                />
              </td>

              <td className="text-end">{formatCurrency(invoice.total)}</td>

              <td>
                <CustomTable.RemoveRowButtonTemplate onClick={() => setInvoiceToDismiss(invoice)} />
              </td>
            </tr>
          ))}

          <tr className="text-end fw-bold">
            <td colSpan={pastDue ? 8 : 7}>Batch Total</td>
            <td>{formatCurrency(usdBatchTotal)}</td>
          </tr>

          <tr>
            <td colSpan={pastDue ? 10 : 9} className="border-0">
              <div className="p-1 fw-bold">ZWG</div>
            </td>
          </tr>

          {zwlState.map((invoice) => (
            <tr key={invoice.id}>
              {pastDue && (
                <td>
                  <i
                    title="invoice is past payment period"
                    className="material-icons custom-icon-small text-danger d-block p-0 m-0"
                  >
                    timer
                  </i>
                </td>
              )}

              <td>
                <input
                  type="date"
                  max={today.toISOString().split("T")[0]}
                  min={
                    today.getDate() >= invoice.payment_period_start
                      ? today.toISOString().split("T")[0]
                      : today.getMonth() === 0
                        ? new Date(today.getFullYear() - 1, 11, 26).toISOString().split("T")[0]
                        : new Date(today.getFullYear(), today.getMonth() - 1, 26)
                            .toISOString()
                            .split("T")[0]
                  }
                  className="form-control form-control-sm"
                  value={invoice.invoice_date}
                  onChange={(e) =>
                    zwlDispatch({
                      type: "updateInvDate",
                      id: invoice.id,
                      invoice_date: e.target.value,
                    })
                  }
                />
              </td>

              <td>{invoice.tenant_name}</td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.tenant_acc_no}
                  onChange={(e) =>
                    zwlDispatch({
                      type: "updateTenantAccNumber",
                      id: invoice.id,
                      tenant_acc_no: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.invoice_no}
                  onChange={(e) =>
                    zwlDispatch({
                      type: "updateInvNumber",
                      id: invoice.id,
                      invoice_no: e.target.value,
                    })
                  }
                />
              </td>

              <td>{invoice.lease_currency_type}</td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.owing_amount}
                  onChange={(e) =>
                    zwlDispatch({
                      type: "updateBaseRental",
                      id: invoice.id,
                      owing_amount: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  className="form-control form-control-sm"
                  value={invoice.operationalCosts}
                  onChange={(e) =>
                    zwlDispatch({
                      type: "updateOperatingCosts",
                      id: invoice.id,
                      operationalCosts: e.target.value,
                    })
                  }
                />
              </td>

              <td className="text-end">{formatCurrency(invoice.total)}</td>

              <td>
                <CustomTable.RemoveRowButtonTemplate onClick={() => setInvoiceToDismiss(invoice)} />
              </td>
            </tr>
          ))}

          <tr className="text-end fw-bold">
            <td colSpan={pastDue ? 8 : 7}>Batch Total</td>
            <td>{formatCurrency(zwlBatchTotal)}</td>
          </tr>
        </tbody>
      </CustomTable.Table>

      <div className="text-end p-3">
        <CustomTable.ActionButtonTemplate onClick={submitData}>
          {isLoading ? (
            <>
              <span className="spinner-grow spinner-grow-sm d-inline-block me-2" />
              processing..
            </>
          ) : (
            "Submit"
          )}
        </CustomTable.ActionButtonTemplate>
      </div>
    </div>
  );
}

Invoicing.layout = (page) => <Layout children={page} title={"Tenant Invoicing"} />;
