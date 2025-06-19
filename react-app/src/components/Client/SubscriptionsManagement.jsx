import useSubscriptionsManagement from "../../hooks/component-hooks/useSubscriptionsManagement.js";
import IndividualLeaseForm from "../../components/features/leases/IndividualLeaseForm.jsx";
import CompanyLeaseForm from "../../components/features/leases/CompanyLeaseForm.jsx";
import ContentModal from "../../components/ContentModal.jsx";
import CustomTable from "../../components/Client/table/CustomTable.jsx";
import { friendlyDate } from "../../utils/index.js";

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
        size="lg"
        title="Available Subscriptions"
        centerTitle
      >
        <CustomTable.Table>
          <CustomTable.ColGroup ratios={[1, 1, 1, 1, 1, 1]} />

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
                <tr key={i} className="text-nowrap">
                  <th>{i + 1}</th>
                  <td>{sub.open_slots}</td>
                  <td>{sub.period_length}</td>
                  <td>{friendlyDate(sub.start_date)}</td>
                  <td>{friendlyDate(sub.end_date)}</td>
                  <td>
                    <CustomTable.ActionButtonsContainer>
                      <CustomTable.ActionButtonTemplate
                        variant="success"
                        onClick={() => activateSub(sub, "individual")}
                      >
                        Activate Individual
                      </CustomTable.ActionButtonTemplate>
                      <CustomTable.ActionButtonTemplate onClick={() => activateSub(sub, "company")}>
                        Activate Company
                      </CustomTable.ActionButtonTemplate>
                    </CustomTable.ActionButtonsContainer>
                  </td>
                </tr>
              ))}
          </tbody>
        </CustomTable.Table>
      </ContentModal>
    </>
  );
}
