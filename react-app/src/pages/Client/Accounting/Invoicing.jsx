import Layout from '../../../components/Layouts/client/Layout.jsx';
import DismissInvoice from '../../../components/modals/Client/DismissInvoice.jsx';
import useInvoicing from '../../../hooks/page-hooks/useInvoicing.js';
import { formatCurrency } from '../../../utils/formatting.js';
import { Toaster } from 'react-hot-toast';

export default function Invoicing(props) {
  const {
    today,
    pastDue,
    usdBatchTotal,
    zwlBatchTotal,
    usdState,
    zwlState,
    isLoading,
    headerDate,
    invoiceToDismiss,
    usdDispatch,
    zwlDispatch,
    submitData,
    confirmDismissal,
    setInvoiceToDismiss,
  } = useInvoicing(props);

  return (
    <div className="card card-raised">
      {Boolean(invoiceToDismiss) && (
        <DismissInvoice
          show
          invoice={invoiceToDismiss}
          confirmDismissal={confirmDismissal}
          handleClose={() => setInvoiceToDismiss(null)}
        />
      )}

      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <div className="h5 m-0 p-3 bg-info text-center text-white">
        Rental Invoicing - {headerDate}
      </div>

      <div className="card-body p-4">
        <table className="table table-sm table-responsive table-bordered custom-fs-normal">
          <thead className="position-sticky c-table-top bg-white shadow-sm">
            <tr>
              {pastDue && <th></th>}
              <th>Inv. Date</th>
              <th>Tenant Name</th>
              <th>Tenant Acc. No.</th>
              <th>Inv. No.</th>
              <th>Currency</th>
              <th>Base Rental</th>
              <th>Operating Costs</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th className="border-0 py-3">USD</th>
            </tr>

            {usdState.map((invoice) => (
              <tr key={invoice.id}>
                {pastDue && (
                  <td className="text-center px-0">
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
                    max={today.toISOString().split('T')[0]}
                    min={
                      today.getDate() >= invoice.payment_period_start
                        ? today.toISOString().split('T')[0]
                        : today.getMonth() === 0
                          ? new Date(today.getFullYear() - 1, 11, 26)
                              .toISOString()
                              .split('T')[0]
                          : new Date(
                              today.getFullYear(),
                              today.getMonth() - 1,
                              26
                            )
                              .toISOString()
                              .split('T')[0]
                    }
                    className="form-control form-control-sm"
                    value={invoice.invoice_date}
                    onChange={(e) =>
                      usdDispatch({
                        type: 'updateInvDate',
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
                        type: 'updateTenantAccNumber',
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
                        type: 'updateInvNumber',
                        id: invoice.id,
                        invoice_no: e.target.value,
                      })
                    }
                  />
                </td>

                <td>{invoice.lease_currency_type}</td>

                <td>
                  <input
                    // type="number"
                    className="form-control form-control-sm"
                    value={invoice.owing_amount}
                    onChange={(e) =>
                      usdDispatch({
                        type: 'updateBaseRental',
                        id: invoice.id,
                        owing_amount: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    // type="number"
                    className="form-control form-control-sm"
                    value={invoice.operationalCosts}
                    onChange={(e) =>
                      usdDispatch({
                        type: 'updateOperatingCosts',
                        id: invoice.id,
                        operationalCosts: e.target.value,
                      })
                    }
                  />
                </td>

                <td className="text-end">{formatCurrency(invoice.total)}</td>

                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setInvoiceToDismiss(invoice)}
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}

            <tr className="text-end fw-bold">
              <td colSpan={6}></td>
              <td>Batch Total</td>
              <td>{formatCurrency(usdBatchTotal)}</td>
            </tr>

            <tr>
              <th className="border-0 py-3">ZWG</th>
            </tr>

            {zwlState.map((invoice) => (
              <tr key={invoice.id}>
                {pastDue && (
                  <td
                    title="invoice is past payment period"
                    className="text-center px-0"
                  >
                    <i className="material-icons custom-icon-small text-danger d-block p-0 m-0">
                      timer
                    </i>
                  </td>
                )}

                <td>
                  <input
                    type="date"
                    max={today.toISOString().split('T')[0]}
                    min={
                      today.getDate() >= invoice.payment_period_start
                        ? today.toISOString().split('T')[0]
                        : today.getMonth() === 0
                          ? new Date(today.getFullYear() - 1, 11, 26)
                              .toISOString()
                              .split('T')[0]
                          : new Date(
                              today.getFullYear(),
                              today.getMonth() - 1,
                              26
                            )
                              .toISOString()
                              .split('T')[0]
                    }
                    className="form-control form-control-sm"
                    value={invoice.invoice_date}
                    onChange={(e) =>
                      zwlDispatch({
                        type: 'updateInvDate',
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
                        type: 'updateTenantAccNumber',
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
                        type: 'updateInvNumber',
                        id: invoice.id,
                        invoice_no: e.target.value,
                      })
                    }
                  />
                </td>

                <td>{invoice.lease_currency_type}</td>

                <td>
                  <input
                    // type="number"
                    className="form-control form-control-sm"
                    value={invoice.owing_amount}
                    onChange={(e) =>
                      zwlDispatch({
                        type: 'updateBaseRental',
                        id: invoice.id,
                        owing_amount: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    // type="number"
                    className="form-control form-control-sm"
                    value={invoice.operationalCosts}
                    onChange={(e) =>
                      zwlDispatch({
                        type: 'updateOperatingCosts',
                        id: invoice.id,
                        operationalCosts: e.target.value,
                      })
                    }
                  />
                </td>

                <td className="text-end">{formatCurrency(invoice.total)}</td>

                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setInvoiceToDismiss(invoice)}
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}

            <tr className="text-end fw-bold">
              <td colSpan={6}></td>
              <td>Batch Total</td>
              <td>{formatCurrency(zwlBatchTotal)}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-end">
          <button onClick={submitData} className="btn btn-info text-white">
            {isLoading ? (
              <>
                <span className="spinner-grow spinner-grow-sm d-inline-block me-2" />
                processing..
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

Invoicing.layout = (page) => (
  <Layout children={page} title={'Tenant Invoicing'} />
);
