import React from "react";
import Layout from "../../components/Layouts/client/Layout.jsx";
import IndividualLeaseForm from "../../components/features/leases/IndividualLeaseForm.jsx";
import CompanyLeaseForm from "../../components/features/leases/CompanyLeaseForm.jsx";
import TerminateLease from "../../components/modals/Client/TerminateLease.jsx";
import Receipt from "../../components/features/leases/Receipt.jsx";
import BottomDrawer from "../../components/Drawer.jsx";
import PaginationControls from "../../components/PaginationControls.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ClientView from "../../components/Client/ClientView/ClientView.jsx";
import useLeaseManagement from "../../hooks/page-hooks/useLeaseManagement.js";
import { formatCurrency } from "../../utils/formatting.js";
import { DrawerContent } from "../../components/DrawerContent.jsx";
import NewPageHeader from "../../components/NewPageHeader.jsx";

export default function Index({ leases, total_pages, current_page }) {
  const {
    sort,
    details,
    rateText,
    isVisible,
    subLength,
    terminate,
    totalColor,
    showReceipt,
    subscriptions,
    clientViewProps,
    activeLeaseCount,
    showCompanyLeaseForm,
    showIndividualLeaseForm,
    smartNavigationTotalFormated,
    writeOff,
    sortFunc,
    changeSort,
    setSubLength,
    setIsVisible,
    closeReceipt,
    openReciptFor,
    terminateLease,
    closeTerminate,
    showLeaseFormFor,
    closeCompanyLeaseForm,
    closeIndividualLeaseForm,
  } = useLeaseManagement(leases);

  return (
    <>
      <>
        <ClientView clientViewProps={clientViewProps} />

        {showIndividualLeaseForm && (
          <IndividualLeaseForm
            action={Boolean(Object.keys(details).length) ? "edit" : "add"}
            show={showIndividualLeaseForm}
            handleClose={closeIndividualLeaseForm}
            lesseeDetails={details}
            subscriptionPeriod={
              Boolean(Object.keys(details).length) ? details.lease_period : subLength
            }
          />
        )}

        {showCompanyLeaseForm && (
          <CompanyLeaseForm
            action={Boolean(Object.keys(details).length) ? "edit" : "add"}
            show={showCompanyLeaseForm}
            handleClose={closeCompanyLeaseForm}
            lesseeDetails={details}
            subscriptionPeriod={
              Boolean(Object.keys(details).length) ? details.lease_period : subLength
            }
          />
        )}

        {terminate && (
          <TerminateLease show={terminate} handleClose={closeTerminate} leaseData={details} />
        )}

        {showReceipt && (
          <Receipt
            show={showReceipt}
            handleClose={closeReceipt}
            leaseDetails={details}
            myKey={"leases"}
          />
        )}
      </>

      <main id="hide-footer">
        <div className="container-xl p-0 mb-5">
          <NewPageHeader title={`Lease Management (${activeLeaseCount} active)`} noMargin />

          <div className="position-relative bg-white rounded-2 border">
            <table className="table table-sm table-responsive table-bordered ">
              <thead className="position-sticky bg-white shadow-sm c-table-top">
                <tr>
                  <th colSpan={7}>
                    <div className="d-flex gap-1 justify-content-between align-items-center">
                      <div className="col-5 ">
                        <SearchBar searchBy="name" />
                      </div>

                      <div className="col-auto ">
                        <div className="d-flex  border border-3 overflow-hidden rounded-pill bg-light align-items-center">
                          <label htmlFor="sort" className="form-label border-end border-3  px-3">
                            Sort
                          </label>

                          <select
                            className="shadow-none  form-select py-1 c-select border-0 rounded-0"
                            name="sort"
                            id="sort"
                            value={sort}
                            onChange={changeSort}
                          >
                            <option value="default">Default</option>
                            <option value="rent-owing-asc">Rent Owing asc</option>
                            <option value="rent-owing-des">Rent Owing des</option>
                            <option value="color-asc">Color (rent asc)</option>
                            <option value="color-des">Color (rent des)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>

                <tr className="m-0">
                  <th>Lease ID</th>

                  <th>Tenant</th>

                  <th>Customer Number</th>

                  <th className="text-end">Rent Owing</th>

                  <th className="text-center" colSpan={3}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {leases
                  ? sortFunc(leases).map((lease, index) => (
                      <tr
                        className={lease.terminated ? "c-terminated" : ""}
                        key={lease.lease_id + "-" + index}
                      >
                        <th className="ps-3">{lease.lease_id || ""}</th>

                        <td>
                          <button
                            title="double click to view client"
                            type="button"
                            onDoubleClick={() => clientViewProps.openClientView(lease)}
                            className={`custom-btn text-decoration-underline ${lease.terminated ? "c-terminated" : ""}`}
                          >
                            {lease.name}
                          </button>
                        </td>

                        <td>{lease.customer_number}</td>

                        <td
                          className={`bg-${lease.color} text-white text-end`}
                          style={{
                            backgroundColor: lease.color == "light-red" ? "#f87171" : "",
                          }}
                        >
                          {`${lease.currency} ${formatCurrency(lease.owing_amount).replace(
                            "$",
                            ""
                          )}`}
                        </td>

                        <td
                          className="bg-info text-white text-center c-pointer"
                          onClick={() => openReciptFor(lease)}
                        >
                          Receipt
                        </td>

                        {lease.terminated ? (
                          <>
                            <td className="c-terminated text-center">Terminated</td>

                            <td
                              className="bg-danger text-white text-center c-pointer"
                              onClick={() => writeOff(lease)}
                            >
                              Write off
                            </td>
                          </>
                        ) : (
                          <>
                            <td
                              className="bg-primary text-white text-center c-pointer"
                              onClick={() => showLeaseFormFor(lease)}
                            >
                              Adjust
                            </td>

                            <td
                              className="bg-danger text-white text-center c-pointer"
                              onClick={() => terminateLease(lease)}
                            >
                              Terminate
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  : ""}
              </tbody>

              {totalColor && leases?.length ? (
                <tfoot>
                  <tr>
                    <td className="border-0 pt-5"></td>

                    <td className="border-0 pt-5">Total Debtors: {leases?.length}</td>

                    <td className="border-0 pt-5">Total mount</td>

                    <td className="border-0 pt-5 px-0">
                      <span
                        className={`bg-${totalColor} text-end text-white p-2 w-100 d-inline-block`}
                        style={{
                          backgroundColor: totalColor == "light-red" ? "#f87171" : totalColor,
                        }}
                      >
                        {smartNavigationTotalFormated}
                      </span>
                      {rateText ? (
                        <small className="d-block text-end p-1 text-muted c-fs-smallest">
                          {rateText}
                        </small>
                      ) : (
                        ""
                      )}
                    </td>

                    <td className="border-0 pt-5"></td>
                  </tr>
                </tfoot>
              ) : (
                ""
              )}
            </table>

            <PaginationControls currentPage={current_page} totalPages={total_pages} />
          </div>
        </div>

        <div className="position-fixed w-100 bottom-0 start-0">
          <BottomDrawer
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            trigger={
              <button
                type="button"
                className="btn btn-lg c-bg-warning-light w-100 justify-content-center align-items-center text-capitalize gap-2 "
              >
                Available Subscriptions
                <i className="material-icons fs-3">keyboard_arrow_up</i>
              </button>
            }
          >
            <DrawerContent title={"Available Subscriptions"}>
              <table className="table table-responsive table-bordered">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Open Slots</th>
                    <th>Period (months)</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {subscriptions
                    ?.filter((sub) => sub.open_slots > 0)
                    .map((sub, i) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>{sub.open_slots}</td>
                        <td>{sub.period_length}</td>
                        <td>{sub.start_date}</td>
                        <td>{sub.end_date}</td>
                        <td
                          className="bg-success text-white text-center c-pointer"
                          onClick={() => {
                            showLeaseFormFor({}, { isCompany: false });
                            setIsVisible(false);
                            setSubLength(sub.period_left);
                          }}
                        >
                          Activate Individual
                        </td>

                        <td
                          className="bg-info text-white text-center c-pointer"
                          onClick={() => {
                            showLeaseFormFor({}, { isCompany: true });
                            setIsVisible(false);
                            setSubLength(sub.period_left);
                          }}
                        >
                          Activate Company
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </DrawerContent>
          </BottomDrawer>
        </div>
      </main>
    </>
  );
}

Index.layout = (page) => <Layout children={page} title={"Leases"} />;
