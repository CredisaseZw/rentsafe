import { Toaster } from 'react-hot-toast';
import Layout from '../../../components/Layouts/client/Layout.jsx';
import useDebtCall from '../../../hooks/page-hooks/useDebtCall.js';
import { fmtAmount } from '../../../utils/index.js';

export default function DebtCall() {
  const { data: customers, processing, handleSubmit } = useDebtCall();

  return (
    <form onSubmit={handleSubmit}>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <h5 className="text-center p-2 mb-4 text-white custom-bg-grey-2 rounded">
        DEBT CALL
      </h5>

      <div className="row align-items-start g-4">
        <div className="col-6">
          <div>
            <div className="mb-3 bg-white border">
              <p className="text-center p-1 mb-0 text-white bg-info">
                Contact Method
              </p>

              <div className="p-2 d-flex gap-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="email"
                    name="contact_methods"
                    id="email_contact_methods"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="email_contact_methods"
                  >
                    Email
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="sms"
                    name="contact_methods"
                    id="sms_contact_methods"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="sms_contact_methods"
                  >
                    SMS
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3 bg-white border">
              <p className="text-center p-1 mb-0 text-white bg-info">
                Filter By Ageing
              </p>

              <div className="p-2 d-flex gap-2 justify-content-around">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="current"
                    name="aging_filters"
                    id="current_aging_filters"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="current_aging_filters"
                  >
                    Current
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="1-30days"
                    name="aging_filters"
                    id="1-30days_aging_filters"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="1-30days_aging_filters"
                  >
                    1-30 Days
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="31-60days"
                    name="aging_filters"
                    id="31-60days_aging_filters"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="31-60days_aging_filters"
                  >
                    31-60 Days
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="61-90days"
                    name="aging_filters"
                    id="61-90days_aging_filters"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="61-90days_aging_filters"
                  >
                    61-90 Days
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="+90days"
                    name="aging_filters"
                    id="+90days_aging_filters"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="+90days_aging_filters"
                  >
                    +90 Days
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3 bg-white border">
              <p className="text-center p-1 mb-0 text-white bg-info">
                Filter By Balance
              </p>

              <div className="p-2 d-flex gap-3 align-items-center justify-content-around">
                <label
                  className="form-label text-nowrap"
                  htmlFor="balance_filter"
                >
                  Contact all debtors with balances above
                </label>
                <input
                  className="form-control form-control-sm c-w-fit"
                  type="number"
                  name="balance_filter"
                  // placeholder="0.00"
                  id="balance_filter"
                />
              </div>
            </div>

            <div className="mb-3 bg-white border">
              <p className="text-center p-1 mb-0 text-white bg-info">
                SMS Message
              </p>

              <div className="p-2 d-flex gap-3 align-items-center">
                <textarea
                  className="form-control"
                  name="sms_message"
                  id="sms_message"
                  rows="3"
                  placeholder="Enter message here..."
                />
              </div>
            </div>

            <div className="mb-3 bg-white border">
              <p className="text-center p-1 mb-0 text-white bg-info">
                Email Message
              </p>

              <div className="p-2 d-flex gap-3 align-items-center">
                <textarea
                  className="form-control"
                  name="email_message"
                  id="email_message"
                  rows="3"
                  placeholder="Enter message here..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div>
            <div className="bg-white">
              <div id="debt-call-table">
                <table className="table table-sm table-bordered table-responsive mb-0 position-relative">
                  <thead className="sticky-top bg-white shadow-sm">
                    <tr>
                      <th>Lease ID </th>
                      <th>Customer Name </th>
                      <th className="text-end">Balance Owing </th>
                      <th>Sms </th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers?.map((customer, index) => (
                      <tr key={index}>
                        <td>{customer.lease_id}</td>

                        <td>{customer.customer_name}</td>

                        <td className="text-end">
                          {`${customer.currency.trim().toUpperCase()} ${fmtAmount(customer.balance_owing).replace('$', '')}`}
                        </td>

                        <td>
                          <div className="form-check d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leases_to_sms"
                              value={customer.lease_id}
                              defaultChecked={!customer.is_company}
                            />
                          </div>
                        </td>

                        <td>
                          <div className="form-check d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leases_to_email"
                              value={customer.lease_id}
                              defaultChecked={customer.is_company}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {customers?.length === 0 && (
                <div className="custom-h-4 d-flex justify-content-center align-items-center border border-2">
                  Nothing to show
                </div>
              )}
            </div>

            <div className="text-end p-4">
              <button
                disabled={customers?.length === 0}
                type="submit"
                className="btn btn-info text-white gap-2"
              >
                {processing ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm" />
                    <span>Processing..</span>
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

DebtCall.layout = (page) => <Layout children={page} title={'Debt Call'} />;
