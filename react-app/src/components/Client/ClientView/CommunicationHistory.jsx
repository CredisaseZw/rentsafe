import SectionSkeleton from "./SectionSkeleton.jsx";
import { friendlyDateAndTime } from "../../../utils/index.js";
import useCommunicationHistory from "../../../hooks/component-hooks/useCommunicationHistory.js";
import { truncate } from "lodash";
import WorksAndMaintenance from "./WorksAndMaintenance.jsx";
import PropertyInspection from "../../PropertyInspection.jsx";

export default function CommunicationHistory({
  disabled,
  lease,
  messages: initialMessages,
  clientId,
  isCreditorView,
  creditorId,
  refresh,
}) {
  const {
    error,
    worksData,
    isLoading,
    remainderType,
    messagesToMap,
    setError,
    closeWorks,
    handleSubmit,
    setRemainderType,
    openWorksOrMaintenance,
  } = useCommunicationHistory(initialMessages, clientId, isCreditorView);

  return (
    <>
      {remainderType === "works" && (
        <WorksAndMaintenance
          isOpen={remainderType === "works"}
          close={closeWorks}
          viewDefaults={worksData}
          lease={lease}
          creditorId={creditorId}
          refresh={refresh}
        />
      )}

      {remainderType === "inspection" && (
        <PropertyInspection
          isOpen={remainderType === "inspection"}
          close={() => setRemainderType("note")}
        />
      )}

      <SectionSkeleton noBoundary title="communication history">
        <div className="custom-bg-whitesmoke px-5 py-3">
          <div className="custom-vh-50 custom-overflow-y-auto">
            {messagesToMap.map((message, index) =>
              message.communicationType === "works" ||
              message.communicationType === "maintenance" ? (
                <div key={index} className="custom-message py-2 px-3 border shadow-sm mb-3">
                  <small>
                    <b className="text-capitalize">
                      {`${message.communicationType} Schedule - ${message.data.title}`}
                    </b>
                    <br />
                    {message.data.details || ""}{" "}
                    <a
                      onClick={() =>
                        openWorksOrMaintenance({
                          communicationType: message.communicationType,
                          ...message.data,
                        })
                      }
                      role="button"
                      className="btn-link fw-bold ps-1 text-success "
                    >
                      view
                    </a>
                  </small>

                  <div className="mt-2 d-flex justify-content-end align-items-center text-end gap-2">
                    <small className="smallest">
                      <b>
                        {message.user || "n/a"}
                        {message.communicationType &&
                          " | " + message.communicationType.toLowerCase()}
                      </b>
                    </small>

                    <small className="text-success smallest">
                      {friendlyDateAndTime(message.timestamp)}
                    </small>
                  </div>
                </div>
              ) : (
                <div key={index} className="custom-message py-2 px-3 border shadow-sm mb-3">
                  <small>
                    {message.text +
                      (message.communicationType.toLowerCase().trim() !== "note" &&
                      message.actionDone
                        ? ` (action date: ${friendlyDateAndTime(message.actionDone)})`
                        : "")}
                  </small>

                  <div className="mt-2 d-flex justify-content-end align-items-center text-end gap-2">
                    <small className="smallest">
                      <b>
                        {message.user || "n/a"}
                        {message.communicationType &&
                          " | " + message.communicationType.toLowerCase()}
                      </b>
                    </small>

                    <small className="text-success smallest">
                      {friendlyDateAndTime(message.timestamp)}
                    </small>
                  </div>
                </div>
              )
            )}

            {messagesToMap.length === 0 && (
              <small className="h-100 text-grey d-flex justify-content-center align-items-center text-center">
                No communication <br /> history
              </small>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-top border-4 w-100 pt-3">
            {error && (
              <p className="d-flex align-items-start gap-1 small text-danger">
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="btn-close btn-sm"
                ></button>

                {truncate(error, { length: 150 })}
              </p>
            )}

            <textarea
              rows={2}
              name="message"
              id="message"
              placeholder="Type message here..."
              className="d-block w-100 p-2 custom-form-control border-0 border-bottom border-bottom-3 border-dark"
              required
              disabled={isLoading}
            ></textarea>

            <div className="d-flex flex-wrap justify-content-center pt-2 gap-2 align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="note"
                  id="reminder_type-note"
                  checked={remainderType === "note"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-note">
                  Note
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="sms"
                  id="reminder_type-sms"
                  checked={remainderType === "sms"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-sms">
                  SMS
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="email"
                  id="reminder_type-email"
                  checked={remainderType === "email"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-email">
                  Email
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="reminder"
                  id="reminder_type-reminder"
                  checked={remainderType === "reminder"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-reminder">
                  Reminder
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="works"
                  id="reminder_type-works"
                  checked={remainderType === "works"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-works">
                  Works
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="reminder_type"
                  disabled={isLoading}
                  value="inspection"
                  id="reminder_type-inspection"
                  checked={remainderType === "inspection"}
                  onChange={(e) => setRemainderType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reminder_type-inspection">
                  Inspection
                </label>
              </div>
            </div>

            {remainderType !== "note" && remainderType !== "works" && (
              <div className="d-flex my-2 gap-2 align-items-center justify-content-center">
                <label htmlFor="action_date" className="small d-block text-nowrap form-label">
                  {`${remainderType === "reminder" ? "Show" : "Send"} ${remainderType} on:`}
                </label>
                <input
                  min={new Date().toISOString().split("T")[0]}
                  type="date"
                  className="form-control form-control-sm rounded-4"
                  name="action_date"
                  id="action_date"
                  required
                />
              </div>
            )}

            <button
              disabled={isLoading || disabled}
              type="submit"
              className="d-block btn btn-info w-100 mt-4 text-white"
            >
              {isLoading ? "Submiting..." : "Submit"}
            </button>
          </form>
        </div>
      </SectionSkeleton>
    </>
  );
}
