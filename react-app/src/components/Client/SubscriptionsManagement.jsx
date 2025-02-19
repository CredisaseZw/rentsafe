import React from 'react';
import { Modal } from 'react-bootstrap';
import IndividualLeaseForm from '../../components/features/leases/IndividualLeaseForm.jsx';
import CompanyLeaseForm from '../../components/features/leases/CompanyLeaseForm.jsx';
import useSubscriptionsManagement from '../../hooks/component-hooks/useSubscriptionsManagement.js';

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

      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        backdrop="static"
        centered
      >
        <Modal.Header>
          <div className="w-100 p-4 position-relative">
            <h4 className="text-center">Available Subscriptions</h4>

            <button
              type="button"
              onClick={closeModal}
              className="btn btn-danger btn-sm position-absolute end-0 top-0 m-3"
            >
              <i className="material-icons">close</i>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
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
                      onClick={() => activateSub(sub, 'individual')}
                    >
                      Activate Individual
                    </td>
                    <td
                      className="bg-info text-white text-center c-pointer"
                      onClick={() => activateSub(sub, 'company')}
                    >
                      Activate Company
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}
