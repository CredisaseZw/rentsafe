import Layout from "../../../components/Layouts/client/Layout.jsx";
import useDebtCall from "../../../hooks/page-hooks/useDebtCall.js";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import NewPageHeader from "../../../components/NewPageHeader.jsx";
import { fmtAmount } from "../../../utils/index.js";

export default function DebtCall() {
  const { data: customers, processing, handleSubmit } = useDebtCall();

  return (
    <form onSubmit={handleSubmit}>
      <NewPageHeader title="Debt Call" color="dark" />

      <div className="row align-items-start g-4">
        <div className="col-6">
          <div>
            <fieldset className="mb-2 bg-light border custom-rounded-1 border-2 c-border-semi-dark">
              <legend className="px-1">Contact Method</legend>

              <div className="d-flex gap-2 small">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="email"
                    name="contact_methods"
                    id="email_contact_methods"
                  />
                  <label className="form-check-label" htmlFor="email_contact_methods">
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
                  <label className="form-check-label" htmlFor="sms_contact_methods">
                    SMS
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset className="mb-2 bg-light border custom-rounded-1 border-2 c-border-semi-dark">
              <legend className="px-1">Filter By Ageing</legend>

              <div className="d-flex flex-wrap small">
                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="current"
                    name="aging_filters"
                    id="current_aging_filters"
                  />
                  <label className="form-check-label" htmlFor="current_aging_filters">
                    Current
                  </label>
                </div>

                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="1-30days"
                    name="aging_filters"
                    id="1-30days_aging_filters"
                  />
                  <label className="form-check-label" htmlFor="1-30days_aging_filters">
                    1-30 Days
                  </label>
                </div>

                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="31-60days"
                    name="aging_filters"
                    id="31-60days_aging_filters"
                  />
                  <label className="form-check-label" htmlFor="31-60days_aging_filters">
                    31-60 Days
                  </label>
                </div>

                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="61-90days"
                    name="aging_filters"
                    id="61-90days_aging_filters"
                  />
                  <label className="form-check-label" htmlFor="61-90days_aging_filters">
                    61-90 Days
                  </label>
                </div>

                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="+90days"
                    name="aging_filters"
                    id="+90days_aging_filters"
                  />
                  <label className="form-check-label" htmlFor="+90days_aging_filters">
                    +90 Days
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset className="mb-2 bg-light border custom-rounded-1 border-2 c-border-semi-dark">
              <legend className="px-1">Filter By Balance</legend>

              <div className="d-flex gap-3 align-items-center justify-content-around">
                <label className="form-label text-nowrap" htmlFor="balance_filter">
                  Contact all debtors with balances above
                </label>
                <input
                  className="form-control form-control-sm c-w-fit"
                  type="number"
                  name="balance_filter"
                  placeholder="0.00"
                  id="balance_filter"
                />
              </div>
            </fieldset>

            <fieldset className="mb-2 bg-light border custom-rounded-1 border-2 c-border-semi-dark">
              <legend className="px-1">SMS Message</legend>

              <div className="d-flex gap-3 align-items-center">
                <textarea
                  className="form-control"
                  name="sms_message"
                  id="sms_message"
                  rows={2}
                  placeholder="Enter message here..."
                />
              </div>
            </fieldset>

            <fieldset className="mb-2 bg-light border custom-rounded-1 border-2 c-border-semi-dark">
              <legend className="px-1">Email Message</legend>

              <div className="d-flex gap-3 align-items-center">
                <textarea
                  className="form-control"
                  name="email_message"
                  id="email_message"
                  rows={2}
                  placeholder="Enter message here..."
                />
              </div>
            </fieldset>
          </div>
        </div>

        <div className="col-6">
          <div>
            <div id="debt-call-table" className="position-relative">
              <CustomTable.Table>
                <CustomTable.ColGroup ratios={[1, null, 1, 1, 1]} />

                <thead className="sticky-top bg-white shadow-sm">
                  <tr>
                    <th>Lease</th>
                    <th>Customer Name </th>
                    <th className="text-end">Balance Owing </th>
                    <th>Sms </th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {customers?.length === 0 && <CustomTable.NothingToShow colSpan={5} />}

                  {customers?.map((customer, index) => (
                    <tr key={index}>
                      <td>
                        <small>{customer.lease_id}</small>
                      </td>

                      <td>
                        <small>{customer.customer_name}</small>
                      </td>

                      <td className="text-end">
                        <small>
                          {`${customer.currency.trim().toUpperCase()} ${fmtAmount(customer.balance_owing).replace("$", "")}`}
                        </small>
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
              </CustomTable.Table>
            </div>

            <div className="text-end p-4">
              <CustomTable.ActionButtonTemplate disabled={customers?.length === 0} type="submit">
                {processing ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm me-2" />
                    <span>Processing..</span>
                  </>
                ) : (
                  "Send"
                )}
              </CustomTable.ActionButtonTemplate>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

DebtCall.layout = (page) => <Layout children={page} title={"Debt Call"} />;
