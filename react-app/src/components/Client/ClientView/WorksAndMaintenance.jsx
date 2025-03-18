import useWorksAndMaintenance from "../../../hooks/component-hooks/useWorksAndMaintenance";
import { Modal } from "react-bootstrap";

export default function WorksAndMaintenance({
  isOpen,
  close,
  lease,
  creditorId,
  viewDefaults,
  refresh,
}) {
  const {
    activeTab,
    isLoading,
    oncePerMonths,
    wasSuccessful,
    maintenanceFrequency,
    showWorks,
    submitWorks,
    showMaintenance,
    setOncePerMonths,
    submitMaintenance,
    setWasSuccessful,
    setMaintenanceFrequency,
  } = useWorksAndMaintenance(lease.lease_id, creditorId, refresh, viewDefaults);

  return (
    <>
      <Modal
        show={isOpen}
        onHide={() => {
          setWasSuccessful(false);
          close();
        }}
        size="lg"
        contentClassName="custom-bg-whitesmoke"
        backdrop="static"
        centered
      >
        <Modal.Header className="p-0">
          <div className="w-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              {!(isLoading || wasSuccessful) && (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={showWorks}
                    style={viewDefaults ? (!viewDefaults.isWorks ? { display: "none" } : {}) : {}}
                    className={
                      activeTab === "works" ? "btn btn-info text-white" : "btn btn-outline-info"
                    }
                  >
                    Works Schedule
                  </button>

                  <button
                    type="button"
                    onClick={showMaintenance}
                    style={viewDefaults ? (viewDefaults.isWorks ? { display: "none" } : {}) : {}}
                    className={
                      activeTab === "maintenance"
                        ? "btn btn-info text-white"
                        : "btn btn-outline-info"
                    }
                  >
                    Maintenance Schedule
                  </button>
                </div>
              )}

              <div className="ms-auto d-flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWasSuccessful(false);
                    close();
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <i className="material-icons fs-3">close</i>
                </button>
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="custom-mn-h-5 position-relative p-3 pb-0">
            {isLoading && (
              <div className="text-center position-absolute top-50 start-50 translate-middle">
                <div className="spinner-border text-info spinner-border-md" role="status">
                  <span className="visually-hidden">Submitting...</span>
                </div>
                <p>Submitting...please wait</p>
              </div>
            )}

            {wasSuccessful && (
              <div className="position-absolute text-center top-50 start-50 translate-middle">
                <div>
                  <i className="material-icons fs-1 text-success">check_circle</i>
                </div>
                <p>
                  Done! <br />
                  <button
                    type="button"
                    className="btn btn-info text-white mt-2"
                    onClick={() => {
                      setWasSuccessful(false);
                      close();
                    }}
                  >
                    Close
                  </button>
                </p>
              </div>
            )}

            <div className={isLoading || wasSuccessful ? "d-none" : "d-block"}>
              {(viewDefaults && viewDefaults.isWorks) || activeTab === "works" ? (
                <WorksTab viewDefaults={viewDefaults} lease={lease} submit={submitWorks} />
              ) : (
                <MaintenanceTab
                  {...{
                    lease,
                    oncePerMonths,
                    setOncePerMonths,
                    maintenanceFrequency,
                    setMaintenanceFrequency,
                    submit: submitMaintenance,
                    viewDefaults,
                  }}
                />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function WorksTab({ submit, lease, viewDefaults }) {
  return (
    <form onSubmit={submit}>
      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="property" className="form-label small w-25">
          Property:
        </label>

        <input
          className="form-control"
          name="property"
          id="property"
          defaultValue={viewDefaults?.property ? undefined : lease?.address}
          {...(viewDefaults
            ? {
                value: viewDefaults.property,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="tenant_landlord" className="form-label small w-25">
          Tenant / Landlord:
        </label>

        <input
          className="form-control"
          name="tenant_landlord"
          id="tenant_landlord"
          defaultValue={
            viewDefaults?.tenant_landlord ? undefined : lease?.name || lease.trading_name
          }
          {...(viewDefaults
            ? {
                value: viewDefaults.tenant_landlord,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="works_title" className="form-label small w-25">
          Works Title:
        </label>

        <input
          className="form-control"
          name="works_title"
          id="works_title"
          {...(viewDefaults
            ? {
                value: viewDefaults.title,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="works_detail" className="form-label small w-25">
          Works Detail:
        </label>

        <input
          className="form-control"
          name="works_detail"
          id="works_detail"
          {...(viewDefaults
            ? {
                value: viewDefaults.details,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="tradesman" className="form-label small w-25">
          Trades Required:
        </label>

        <input
          className="form-control"
          name="tradesman"
          id="tradesman"
          {...(viewDefaults
            ? {
                value: viewDefaults.tradesman,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="contractor_name" className="form-label small w-25">
          Contractor Name:
        </label>

        <input
          className="form-control"
          name="contractor_name"
          id="contractor_name"
          {...(viewDefaults
            ? {
                value: viewDefaults.contractor_name || viewDefaults.contractor,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="required" className="form-label small w-25">
          Inputs Required:
        </label>

        <input
          className="form-control"
          name="required"
          id="required"
          {...(viewDefaults
            ? {
                value: viewDefaults.required || viewDefaults.required_materials,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="budget" className="form-label small w-25">
          Budget:
        </label>

        <input
          className="form-control"
          type="number"
          name="budget"
          id="budget"
          step={0.01}
          {...(viewDefaults
            ? {
                value: viewDefaults.budget,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="whose_account" className="form-label small w-25">
          Whose account:
        </label>

        <div className="d-flex gap-3 align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="tenant"
              value="tenant"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "tenant" ||
                      viewDefaults.responsible_person === "tenant",
                    readOnly: true,
                  }
                : {
                    defaultChecked: !lease?.is_company,
                  })}
            />
            <label className="form-check-label" htmlFor="tenant">
              Tenant
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="landlord"
              value="landlord"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "landlord" ||
                      viewDefaults.responsible_person === "landlord",
                    readOnly: true,
                  }
                : {
                    defaultChecked: lease?.is_company,
                  })}
            />
            <label className="form-check-label" htmlFor="landlord">
              Landlord
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="agent"
              value="agent"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "agent" ||
                      viewDefaults.responsible_person === "agent",
                    readOnly: true,
                  }
                : {})}
            />
            <label className="form-check-label" htmlFor="agent">
              Agent
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="reason" className="form-label small w-25">
          Reason:
        </label>

        <input
          className="form-control"
          name="reason"
          id="reason"
          {...(viewDefaults
            ? {
                value: viewDefaults.reason,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="date_schedule" className="form-label small w-25">
          Date Schedule:
        </label>

        <input
          type="date"
          className="form-control"
          name="date_schedule"
          required
          id="date_schedule"
          {...(viewDefaults
            ? {
                value:
                  viewDefaults.date_schedule || viewDefaults.scheduled_date
                    ? new Date(viewDefaults.date_schedule || viewDefaults.scheduled_date)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0],
                readOnly: true,
              }
            : {
                min: new Date().toISOString().split("T")[0],
              })}
        />
      </div>

      <div className={`mt-5 text-end ${viewDefaults ? "d-none" : ""}`}>
        <button type="submit" className="btn btn-info text-white">
          Submit
        </button>
      </div>
    </form>
  );
}

function MaintenanceTab({
  submit,
  lease,
  maintenanceFrequency,
  setMaintenanceFrequency,
  oncePerMonths,
  setOncePerMonths,
  viewDefaults,
}) {
  let dates = [];
  for (let i = 1; i < 32; i++) {
    dates.push(i);
  }

  return (
    <form onSubmit={submit}>
      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="property" className="form-label small w-25">
          Property:
        </label>

        <input
          className="form-control"
          name="property"
          id="property"
          defaultValue={viewDefaults?.property ? undefined : lease?.address}
          {...(viewDefaults
            ? {
                value: viewDefaults.property,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="tenant_landlord" className="form-label small w-25">
          Tenant / Landlord:
        </label>

        <input
          className="form-control"
          name="tenant_landlord"
          id="tenant_landlord"
          defaultValue={
            viewDefaults?.tenant_landlord ? undefined : lease?.name || lease.trading_name
          }
          {...(viewDefaults
            ? {
                value: viewDefaults.tenant_landlord,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="maintenance_title" className="form-label small w-25">
          Maintenance Title:
        </label>

        <input
          className="form-control"
          name="maintenance_title"
          id="maintenance_title"
          {...(viewDefaults
            ? {
                value: viewDefaults.title,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="maintenance_detail" className="form-label small w-25">
          Maintenance Detail:
        </label>

        <input
          className="form-control"
          name="maintenance_detail"
          id="maintenance_detail"
          {...(viewDefaults
            ? {
                value: viewDefaults.details,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="tradesman" className="form-label small w-25">
          Trades Required:
        </label>

        <input
          className="form-control"
          name="tradesman"
          id="tradesman"
          {...(viewDefaults
            ? {
                value: viewDefaults.tradesman,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="contractor_name" className="form-label small w-25">
          Contractor Name:
        </label>

        <input
          className="form-control"
          name="contractor_name"
          id="contractor_name"
          {...(viewDefaults
            ? {
                value: viewDefaults.contractor_name || viewDefaults.contractor,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="required" className="form-label small w-25">
          Inputs Required:
        </label>

        <input
          className="form-control"
          name="required"
          id="required"
          {...(viewDefaults
            ? {
                value: viewDefaults.required || viewDefaults.required_materials,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="budget" className="form-label small w-25">
          Budget:
        </label>

        <input
          className="form-control"
          type="number"
          step={0.01}
          name="budget"
          id="budget"
          {...(viewDefaults
            ? {
                value: viewDefaults.budget,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="whose_account" className="form-label small w-25">
          Whose account:
        </label>

        <div className="d-flex gap-3 align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="tenant"
              value="tenant"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "tenant" ||
                      viewDefaults.responsible_person === "tenant",
                    readOnly: true,
                  }
                : {
                    defaultChecked: !lease?.is_company,
                  })}
            />
            <label className="form-check-label" htmlFor="tenant">
              Tenant
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="landlord"
              value="landlord"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "landlord" ||
                      viewDefaults.responsible_person === "landlord",
                    readOnly: true,
                  }
                : {
                    defaultChecked: lease?.is_company,
                  })}
            />
            <label className="form-check-label" htmlFor="landlord">
              Landlord
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="whose_account"
              id="agent"
              value="agent"
              {...(viewDefaults
                ? {
                    checked:
                      viewDefaults.whose_account === "agent" ||
                      viewDefaults.responsible_person === "agent",
                    readOnly: true,
                  }
                : {})}
            />
            <label className="form-check-label" htmlFor="agent">
              Agent
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="reason" className="form-label small w-25">
          Reason:
        </label>

        <input
          className="form-control"
          name="reason"
          id="reason"
          {...(viewDefaults
            ? {
                value: viewDefaults.reason,
                readOnly: true,
              }
            : {})}
        />
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="frequency" className="form-label small w-25">
          Frequency:
        </label>

        <div className="d-flex gap-3 align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="frequency"
              id="weekly"
              value="weekly"
              {...(viewDefaults
                ? {
                    checked: viewDefaults.frequency === "weekly",
                    readOnly: true,
                  }
                : {
                    checked: maintenanceFrequency === "weekly",
                    onChange: (e) => setMaintenanceFrequency(e.target.value),
                  })}
            />
            <label className="form-check-label" htmlFor="weekly">
              Weekly
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="frequency"
              id="monthly"
              value="monthly"
              {...(viewDefaults
                ? {
                    checked: viewDefaults.frequency === "monthly",
                    readOnly: true,
                  }
                : {
                    checked: maintenanceFrequency === "monthly",
                    onChange: (e) => setMaintenanceFrequency(e.target.value),
                  })}
            />
            <label className="form-check-label" htmlFor="monthly">
              Monthly
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="frequency"
              id="once_per"
              value="once_per"
              {...(viewDefaults
                ? {
                    checked: viewDefaults.frequency === "once_per",
                    readOnly: true,
                  }
                : {
                    checked: maintenanceFrequency === "once_per",
                    onChange: (e) => setMaintenanceFrequency(e.target.value),
                  })}
            />
            <label className="form-check-label" htmlFor="once_per">
              Once every{" "}
              <input
                className="c-once-per-months"
                required={maintenanceFrequency === "once_per"}
                name="month_frequency"
                id="once_per"
                {...(viewDefaults
                  ? {
                      value: viewDefaults.month_frequency || undefined,
                      readOnly: true,
                    }
                  : {
                      value: oncePerMonths,
                      onChange: setOncePerMonths,
                    })}
              />{" "}
              months
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <label htmlFor="date" className="form-label small w-25">
          {(viewDefaults && viewDefaults.frequency === "weekly") ||
          maintenanceFrequency === "weekly"
            ? "Day:"
            : "Date:"}
        </label>

        <select
          className="form-select"
          name="day_date"
          id="day_date"
          required
          {...(viewDefaults
            ? {
                value: viewDefaults.scheduled_day,
                readOnly: true,
              }
            : {
                defaultValue: "",
              })}
        >
          {viewDefaults ? (
            <option value={viewDefaults.scheduled_day}>{viewDefaults.scheduled_day}</option>
          ) : maintenanceFrequency === "weekly" ? (
            <>
              <option value="" disabled>
                Select Day
              </option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </>
          ) : (
            <>
              <option value="" disabled>
                Select Date
              </option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <div className={`mt-5 text-end ${viewDefaults ? "d-none" : ""}`}>
        <button type="submit" className="btn btn-info text-white">
          Submit
        </button>
      </div>
    </form>
  );
}
