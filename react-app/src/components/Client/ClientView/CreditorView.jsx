import { Modal } from "react-bootstrap";
import AgedAnalysis from "./AgedAnalysis.jsx";
import DebtorIntelligence from "./DebtorIntelligence.jsx";
import ContactDetails from "./ContactDetails.jsx";
import ForecastInflows from "./ForecastInflows.jsx";
import CommunicationHistory from "./CommunicationHistory.jsx";
import { truncate } from "lodash";
import Payments from "./Payments.jsx";

export default function CreditorView({
  creditorViewProps: {
    showModal,
    hideCreditorView,
    data,
    error,
    isLoading,
    clientId,
    refreshCreditorViewData,
    lease,
    creditorName,
  },
}) {
  const dontShowData = !Boolean(data);

  return (
    <>
      <Modal
        show={showModal}
        onHide={hideCreditorView}
        fullscreen
        contentClassName="custom-bg-whitesmoke"
      >
        <Modal.Header className="p-0">
          <div className="w-100 p-2 text-center bg-secondary position-relative">
            <h4 className="text-white">
              {isLoading || error || dontShowData
                ? "Creditor View"
                : data.tenantName || "Creditor View"}
            </h4>

            <button
              type="button"
              onClick={hideCreditorView}
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
                    <AgedAnalysis isCreditorView data={data.agedAnalysis} />
                    <DebtorIntelligence
                      isCreditorView
                      data={data.debtorIntelligence}
                      clientId={clientId}
                    />
                    <ContactDetails isCreditorView data={data.contactDetails} clientId={clientId} />
                  </div>

                  <div className="col p-1">
                    <CommunicationHistory
                      isCreditorView
                      messages={data.communicationHistory}
                      clientId={clientId}
                      lease={lease}
                      creditorId={clientId}
                      refresh={refreshCreditorViewData}
                    />
                  </div>

                  <div className="col p-1">
                    <ForecastInflows isCreditorView data={data.forecastInflows} />
                    <Payments
                      {...{
                        isCreditorView: true,
                        clientId,
                        paymentPlans: data.paymentPlans,
                        refreshClientViewData: refreshCreditorViewData,
                        creditorName,
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
