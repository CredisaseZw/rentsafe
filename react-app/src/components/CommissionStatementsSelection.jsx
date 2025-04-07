import { Modal } from "react-bootstrap";
import useCommissionStatementsSelection from "../hooks/modal-hooks/useCommissionStatementsSelection.js";
import { activeTrackableClientNavLinks as NAV_LINKS } from "../constants";

export default function CommissionStatementsSelection({
  btnText,
  btnClass,
  className,
  id,
  makeActive,
  beforeOpenningModal,
}) {
  const {
    show,
    openModal,
    closeModal: hookCloseModal,
    handleSubmit,
    periodSelection,
    setPeriodSelection,
  } = useCommissionStatementsSelection();

  function closeModal() {
    if (makeActive) makeActive("use-last-last");
    hookCloseModal();
  }

  return (
    <>
      <a
        className={btnClass || className}
        onClick={() => {
          beforeOpenningModal();
          openModal();
          if (makeActive && id) makeActive(id);
        }}
      >
        {btnText || "Commission Statements"}
      </a>

      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        contentClassName="custom-bg-whitesmoke"
        backdrop="static"
        centered
      >
        <Modal.Header className="p-0">
          <div className="w-100 p-3 position-relative">
            <h4 className="text-center">Commission Statement Selection</h4>

            <button
              type="button"
              onClick={closeModal}
              className="btn btn-danger btn-sm position-absolute end-0 top-0 m-2"
            >
              <i className="material-icons fs-3">close</i>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <form
            className="custom-mn-h-5 justify-content-center w-75  mx-auto d-flex flex-column"
            onSubmit={handleSubmit}
          >
            <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
              <label htmlFor="commission_type" className="form-label">
                Type :
              </label>

              <select
                className="form-select w-75 form-select-md"
                name="commission_type"
                id="commission_type"
                required
                defaultValue="individual"
              >
                <option value="individual">individual</option>
                <option value="company">company</option>
                <option value="combined">Combined</option>
              </select>
            </div>

            <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
              <label htmlFor="period_selection" className="form-label">
                Period Selection :
              </label>

              <select
                className="form-select w-75"
                name="period_selection"
                id="period_selection"
                required
                value={periodSelection}
                onChange={(e) => setPeriodSelection(e.target.value)}
              >
                <option value="month">Month</option>
                <option value="date">Date</option>
              </select>
            </div>

            <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
              <label className="form-label">Month Selection: </label>

              <div className="w-75 d-flex gap-2 align-items-center">
                <small
                  id="year_help"
                  className="custom-w-10ch text-lowercase d-inline-block form-text text-nowrap text-muted"
                >
                  Year
                </small>

                <select
                  aria-describedby="year_help"
                  name="year"
                  id="year"
                  className="form-select flex-grow-1"
                  required
                  disabled={periodSelection !== "month"}
                  defaultValue={new Date().getFullYear()}
                >
                  {new Array(new Date().getFullYear() - 2020).fill(0).map((_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>

                <small
                  id="month_help"
                  className="custom-w-10ch text-lowercase d-inline-block form-text  text-nowrap text-muted"
                >
                  Month
                </small>

                <select
                  className="form-select flex-grow-1"
                  aria-describedby="month_help"
                  name="month"
                  id="month"
                  defaultValue={(new Date().getMonth() + 1).toString()}
                  required
                  disabled={periodSelection !== "month"}
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
              <label className="form-label">Date Selection: </label>

              <div className="w-75 d-flex gap-2 align-items-center">
                <small
                  id="start_date_help"
                  className="custom-w-10ch text-lowercase d-inline-block form-text  text-nowrap text-muted"
                >
                  Start Date
                </small>
                <input
                  aria-describedby="start_date_help"
                  className="form-control flex-grow-1"
                  name="start_date"
                  id="start_date"
                  type="date"
                  required
                  disabled={periodSelection !== "date"}
                />

                <small
                  id="end_date_help"
                  className="custom-w-10ch text-lowercase d-inline-block form-text  text-nowrap text-muted"
                >
                  End Date
                </small>
                <input
                  aria-describedby="end_date_help"
                  className="form-control flex-grow-1"
                  name="end_date"
                  id="end_date"
                  type="date"
                  required
                  disabled={periodSelection !== "date"}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-info text-white" type="submit">
                Proceed
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
