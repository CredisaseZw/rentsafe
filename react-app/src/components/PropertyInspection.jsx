import { Modal } from "react-bootstrap";
import { residentialInspectionChecklist } from "../constants";
import usePropertyInspection from "../hooks/modal-hooks/usePropertyInspection";
import Checklist from "./Checklist.jsx";

export default function PropertyInspection({ isOpen, close }) {
  const {
    activeTab,
    isLoading,
    wasSuccessful,
    printContentRef,
    printForm,
    showCommercial,
    showResidential,
    setWasSuccessful,
    handleResidentialSubmission,
  } = usePropertyInspection();

  return (
    <>
      <Modal
        show={isOpen}
        onHide={() => {
          setWasSuccessful(false);
          close();
        }}
        size="xl"
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
                    onClick={showResidential}
                    className={
                      activeTab === "residential"
                        ? "btn btn-info text-white"
                        : "btn btn-outline-info"
                    }
                  >
                    Residential
                  </button>

                  <button
                    disabled
                    type="button"
                    onClick={showCommercial}
                    className={
                      activeTab === "maintenance"
                        ? "btn btn-info text-white"
                        : "btn btn-outline-info"
                    }
                  >
                    Commercial
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
              {activeTab === "residential" ? (
                <ResidentialTab
                  printContentRef={printContentRef}
                  printForm={printForm}
                  handleSubmit={handleResidentialSubmission}
                />
              ) : (
                <CommercialTab />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function ResidentialTab({ printContentRef, printForm, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div ref={printContentRef} className="p-4">
        <h5 className="mb-5">PROPERTY INSPECTION CHECKLIST - RESIDENTIAL</h5>

        <div className="mb-3 flex align-items-center ">
          <label htmlFor="address" className="form-label me-3">
            Address
          </label>
          <input
            className="custom-form-control bg-transparent col-6 border-0 border-bottom border-bottom-3 border-dark"
            name="address"
            id="address"
          />
        </div>

        <div className="flex align-items-center ">
          <label htmlFor="date" className="form-label me-3">
            Date
          </label>
          <input
            className="custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
            name="date"
            type="date"
            id="date"
          />
        </div>

        <p className="my-5 px-3">
          M - missing, S - scratched, D - damaged, B - broken, R - repair/replace, W - Water Damage,
          L - Leaking
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
          className="align-items-start mb-4"
        >
          {residentialInspectionChecklist.map((category) => (
            <Checklist key={category.category} category={category} />
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="additional_notes" className="form-label d-block mb-2">
            Additional Notes:
          </label>
          <textarea
            className="form-control w-50"
            rows={4}
            placeholder="Additional Notes:"
            name="additional_notes"
            id="additional_notes"
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="action_items" className="form-label d-block mb-2">
            Action Items:
          </label>
          <textarea
            className="form-control w-50"
            rows={4}
            placeholder="Action Items:"
            name="action_items"
            id="action_items"
          ></textarea>
        </div>

        <fieldset className="rounded p-3 rounded-5 mb-5">
          <legend>Inspector</legend>

          <div className="d-flex mb-3 align-items-center">
            <label htmlFor="inspector_name" className="form-label me-3">
              Name
            </label>

            <input
              className="col-4 custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="inspector_name"
              id="inspector_name"
            />

            <label htmlFor="inspector_signature" className="form-label mx-3">
              Signature
            </label>

            <input
              className="col-4 custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="inspector_signature"
              id="inspector_signature"
            />
          </div>

          <div className="flex align-items-center">
            <label htmlFor="inspector_date" className="form-label me-3">
              Date:
            </label>

            <input
              className="custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="inspector_date"
              id="inspector_date"
              type="date"
            />
          </div>
        </fieldset>

        <fieldset className="rounded p-3 rounded-5 mb-5">
          <legend>Manager Review</legend>

          <div className="d-flex mb-3 align-items-center">
            <label htmlFor="manager_name" className="form-label me-3">
              Name:
            </label>

            <input
              className="col-4 custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="manager_name"
              id="manager_name"
            />

            <label htmlFor="manager_signature" className="form-label mx-3">
              Signature:
            </label>

            <input
              className="col-4 custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="manager_signature"
              id="manager_signature"
            />
          </div>

          <div className="flex align-items-center ">
            <label htmlFor="manager_date" className="form-label me-3">
              Date:
            </label>
            <input
              className="custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
              name="manager_date"
              id="manager_date"
              type="date"
            />
          </div>
        </fieldset>

        <div className="mb-5 flex align-items-center px-3">
          <label htmlFor="score" className="form-label me-3">
            Score (%):
          </label>
          <input
            className="custom-form-control bg-transparent border-0 border-bottom border-bottom-3 border-dark"
            name="score"
            id="score"
            type="number"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end align-items-center pb-5">
        <button onClick={printForm} className="btn btn-dark me-4" type="button">
          Print
        </button>
        <button className="btn btn-success" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

function CommercialTab() {
  return <form>commercial</form>;
}
