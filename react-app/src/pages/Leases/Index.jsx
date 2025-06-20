import Layout from "../../components/Layouts/client/Layout.jsx";
import Receipt from "../../components/features/leases/Receipt.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ClientView from "../../components/Client/ClientView/ClientView.jsx";
import CustomTable from "../../components/Client/table/CustomTable.jsx";
import BottomDrawer from "../../components/Drawer.jsx";
import NewPageHeader from "../../components/NewPageHeader.jsx";
import TerminateLease from "../../components/modals/Client/TerminateLease.jsx";
import CompanyLeaseForm from "../../components/features/leases/CompanyLeaseForm.jsx";
import PaginationControls from "../../components/PaginationControls.jsx";
import useLeaseManagement from "../../hooks/page-hooks/useLeaseManagement.js";
import IndividualLeaseForm from "../../components/features/leases/IndividualLeaseForm.jsx";
import { SearchBarStyles } from "../../constants/index.js";
import { formatCurrency } from "../../utils/formatting.js";
import { DrawerContent } from "../../components/DrawerContent.jsx";

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
            <CustomTable.Table size="lg">
              <CustomTable.ColGroup ratios={[1, null, 1, 1, 1, 1, 1]} />
              <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
                <tr>
                  <th colSpan={7}>
                    <div className="d-flex gap-1 pt-1 justify-content-between align-items-center">
                      <SearchBar searchBy="name" />

                      <div className="col-auto">
                        <div className={SearchBarStyles.containerClassname}>
                          <label htmlFor="sort" className={SearchBarStyles.leftButtonClassname}>
                            Sort
                          </label>

                          <select
                            className="shadow-none form-select form-select-sm c-select border-0 rounded-0"
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

                <tr>
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
                      <tr className={lease.terminated ? "c-terminated" : ""} key={index}>
                        <th>{lease.lease_id || ""}</th>

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

                        <td className="text-nowrap">{lease.customer_number}</td>

                        <td
                          className={`text-nowrap bg-${lease.color} text-white text-end`}
                          style={{ backgroundColor: lease.color == "light-red" ? "#f87171" : "" }}
                        >
                          <div className="px-2">
                            {`${lease.currency} ${formatCurrency(lease.owing_amount).replace(
                              "$",
                              ""
                            )}`}
                          </div>
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
                            {lease.expired ? (
                              <td
                                className="bg-gold text-center c-pointer"
                                onClick={() => showLeaseFormFor(lease)}
                              >
                                Renew
                              </td>
                            ) : (
                              <td
                                className="bg-primary text-white text-center c-pointer"
                                onClick={() => showLeaseFormFor(lease)}
                              >
                                Lease
                              </td>
                            )}

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
            </CustomTable.Table>

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
