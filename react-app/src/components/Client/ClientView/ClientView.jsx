import { Modal } from "react-bootstrap";
import AgedAnalysis from "./AgedAnalysis.jsx";
import DebtorIntelligence from "./DebtorIntelligence.jsx";
import ContactDetails from "./ContactDetails.jsx";
import ForecastInflows from "./ForecastInflows.jsx";
import CommunicationHistory from "./CommunicationHistory.jsx";
import { truncate } from "lodash";
import Payments from "./Payments.jsx";

export default function ClientView({
  clientViewProps: {
    showModal,
    hideClientView,
    data,
    error,
    isLoading,
    clientId,
    refreshClientViewData,
    lease,
  },
}) {
  const dontShowData = !Boolean(data);
  return (
    <>
      <Modal
        show={showModal}
        onHide={hideClientView}
        fullscreen
        contentClassName="custom-bg-whitesmoke"
      >
        <Modal.Header className="p-0">
          <div className="w-100 p-2 text-center bg-info position-relative">
            <h4 className="text-white">
              {isLoading || error || dontShowData ? "Client View" : data.tenantName}
            </h4>

            <button
              type="button"
              onClick={hideClientView}
              className="btn position-absolute top-0 end-0 h-100 d-flex align-items-center text-white"
            >
              <i className="material-icons fs-3 px-4">close</i>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="position-relative custom-mn-h-5">
            {isLoading && (
              <div className="text-center position-absolute top-50 start-50 translate-middle">
                <div className="spinner-border text-info spinner-border-md" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading...please wait</p>
              </div>
            )}

            {error && (
              <div className="text-center text-danger position-absolute top-50 start-50 translate-middle">
                <p>
                  <i className="material-icons fs-1">warning</i>
                </p>

                <p>Error: {truncate(error, { length: 500 })}</p>
              </div>
            )}

            {!(isLoading || error || dontShowData) && (
              <>
                <div className="row row-cols-3 align-items-stretch">
                  <div className="col p-1">
                    <AgedAnalysis data={data.agedAnalysis} />
                    <DebtorIntelligence data={data.debtorIntelligence} clientId={clientId} />
                    <ContactDetails
                      data={data.contactDetails}
                      clientId={clientId}
                      leaseId={lease.lease_id}
                    />
                  </div>

                  <div className="col p-1">
                    <CommunicationHistory
                      messages={data.communicationHistory}
                      clientId={clientId}
                      lease={lease}
                      refresh={refreshClientViewData}
                    />
                  </div>

                  <div className="col p-1">
                    <ForecastInflows data={data.forecastInflows} />
                    <Payments
                      {...{
                        clientId,
                        paymentPlans: data.paymentPlans,
                        refreshClientViewData,
                        leaseId: lease.lease_id,
                        currency: lease.currency,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
