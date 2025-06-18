import useSubscriptionsManagement from "../../hooks/component-hooks/useSubscriptionsManagement.js";
import IndividualLeaseForm from "../../components/features/leases/IndividualLeaseForm.jsx";
import CompanyLeaseForm from "../../components/features/leases/CompanyLeaseForm.jsx";
import ContentModal from "../../components/ContentModal.jsx";

export default function SubscriptionsManagement({
  className,
  id,
  makeActive,
  beforeOpenningModal,
}) {
  const {
    show,
    subLength,
    subscriptions,
    showCompanyLeaseForm,
    showIndividualLeaseForm,
    openModal,
    closeModal,
    activateSub,
    closeCompanyLeaseForm,
    closeIndividualLeaseForm,
  } = useSubscriptionsManagement(makeActive, id, beforeOpenningModal);

  return (
    <>
      <a className={className} onClick={openModal}>
        Subscription Management
      </a>

      <>
        {showIndividualLeaseForm && (
          <IndividualLeaseForm
            action="add"
            show={showIndividualLeaseForm}
            handleClose={closeIndividualLeaseForm}
            lesseeDetails={{}}
            subscriptionPeriod={subLength}
          />
        )}

        {showCompanyLeaseForm && (
          <CompanyLeaseForm
            action="add"
            show={showCompanyLeaseForm}
            handleClose={closeCompanyLeaseForm}
            lesseeDetails={{}}
            subscriptionPeriod={subLength}
          />
        )}
      </>

      <ContentModal
        show={show}
        handleClose={closeModal}
        size="xl"
        title="Available Subscriptions"
        centerTitle
      >
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
                    onClick={() => activateSub(sub, "individual")}
                  >
                    Activate Individual
                  </td>
                  <td
                    className="bg-info text-white text-center c-pointer"
                    onClick={() => activateSub(sub, "company")}
                  >
                    Activate Company
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </ContentModal>
    </>
  );
}
