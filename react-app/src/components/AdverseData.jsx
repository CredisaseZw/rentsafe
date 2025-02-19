import { Modal } from 'react-bootstrap';
import useAdverseDataVersion2 from '../hooks/modal-hooks/useAdverseDataVersion2.js';
import CustomAsyncSelect from './CustomAsyncSelect.jsx';
import { truncate } from 'lodash';

export default function AdverseData({
  className,
  id,
  makeActive,
  beforeOpenningModal,
}) {
  const {
    show,
    openModal,
    closeModal: hookCloseModal,
    activeTab,
    showSingleTab,
    showMultipleTab,
    handleSingleSubmit,
    handleMultipleSubmit,
    creditor,
    data_source,
    form,
    tenantType,
    setTenantType,
  } = useAdverseDataVersion2();

  function closeModal() {
    makeActive('use-last-last');
    hookCloseModal();
  }

  return (
    <>
      <a
        className={className}
        onClick={() => {
          beforeOpenningModal();
          makeActive(id);
          openModal();
        }}
      >
        Claim
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
          <div className="w-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              {!(form.processing || form.wasSuccessful) && (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={showSingleTab}
                    className={
                      activeTab === 'single' ? 'btn btn-info text-white' : 'btn'
                    }
                  >
                    Single
                  </button>

                  <button
                    type="button"
                    onClick={showMultipleTab}
                    disabled
                    className={
                      activeTab === 'multiple'
                        ? 'btn btn-info text-white'
                        : 'btn'
                    }
                  >
                    Multiple
                  </button>
                </div>
              )}

              <div className="ms-auto d-flex gap-2">
                {/* <button type="button" className="btn btn-info text-white">
                  Add Company
                </button>

                <button type="button" className="btn btn-info text-white">
                  Add Individual
                </button> */}

                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-danger btn-sm"
                >
                  <i className="material-icons fs-3">close</i>
                </button>
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="custom-mn-h-5 position-relative">
            {form.processing && (
              <div className="text-center position-absolute top-50 start-50 translate-middle">
                <div
                  className="spinner-border text-info spinner-border-md"
                  role="status"
                >
                  <span className="visually-hidden">Submitting...</span>
                </div>
                <p>Submitting...please wait</p>
              </div>
            )}

            {form.wasSuccessful && (
              <div className="position-absolute text-center top-50 start-50 translate-middle">
                <div>
                  <i className="material-icons fs-1 text-success">
                    check_circle
                  </i>
                </div>
                <p>
                  Submission was successful! <br />
                  <button
                    type="button"
                    className="btn btn-info text-white mt-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </p>
              </div>
            )}

            <div
              className={
                form.processing || form.wasSuccessful ? 'd-none' : 'd-block'
              }
            >
              {activeTab === 'single' ? (
                <SingleTab
                  {...{
                    creditor,
                    data_source,
                    handleSingleSubmit,
                    form,
                    tenantType,
                    setTenantType,
                  }}
                />
              ) : (
                <MultipleTab handleMultipleSubmit={handleMultipleSubmit} />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function SingleTab({
  creditor,
  form,
  handleSingleSubmit,
  tenantType,
  setTenantType,
}) {
  return (
    <form onSubmit={handleSingleSubmit}>
      <div
        className="text-center text-danger"
        style={{ display: form.hasErrors ? 'block' : 'none' }}
      >
        <p>
          <i className="material-icons fs-1">warning</i>
        </p>

        {Object.keys(form.errors).map((key) => (
          <div key={key}>{truncate(form.errors[key], { length: 200 })}</div>
        ))}
      </div>

      <div className="my-3 border-bottom border-top border-2 p-5">
        <label htmlFor="data_type" className="form-label">
          Data Type
        </label>

        <select
          className="form-select custom-mx-w-3 form-select-md"
          name="data_type"
          id="data_type"
          required
          defaultValue={'claim'}
        >
          <option value="claim">Claim</option>
          <option value="absconder">Absconder</option>
          <option value="court">Court</option>
          <option value="public-records">Public Records</option>
        </select>
      </div>

      <div className="my-3">
        <div className="bg-info p-2 mb-2 rounded-2 text-center text-white">
          Creditor
        </div>

        <div className="py-3 d-flex align-items-center justify-content-start">
          <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
            <label htmlFor="creditor_id" className="form-label">
              Creditor ID/Reg #/Name
            </label>

            <input
              className="w-100 custom-form-control-disabled p-2 rounded-2"
              name="creditor_id"
              id="creditor_id"
              required
              value={creditor}
              readOnly
            />
          </div>

          <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
            <label htmlFor="date" className="form-label">
              Data Date
            </label>

            <input
              type="date"
              className="form-control"
              name="date"
              id="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      <div className="my-3">
        <div className="bg-info p-2 mb-2 rounded-2 text-center text-white">
          Debtor
        </div>

        <div className="py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
              <label htmlFor="debtor_type" className="form-label">
                Debtor Type
              </label>

              <select
                className="form-select form-select-md"
                name="debtor_type"
                id="debtor_type"
                required
                value={tenantType}
                onChange={(e) => setTenantType(e.target.value)}
              >
                <option value="" disabled>
                  select debtor type...
                </option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 flex-grow-1 px-5">
              <label htmlFor="debtor_id" className="form-label">
                Debtor ID/Reg #/Name
              </label>

              <CustomAsyncSelect
                key={tenantType}
                extraProps={{
                  required: true,
                  id: 'debtor_id',
                  className: 'w-100',
                  name: 'debtor_id',
                }}
                defaultValue={null}
                isDisabled={tenantType === ''}
                useAlternateFetchOptions={{ type: tenantType.toLowerCase() }}
              />
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
              <label htmlFor="account_number" className="form-label">
                Account Number
              </label>

              <input
                className="form-control"
                name="account_number"
                id="account_number"
              />
            </div>
          </div>

          <div className="mt-2 d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>

              <select
                className="form-select custom-mx-w-3 form-select-md"
                name="currency"
                id="currency"
                required
                defaultValue={'usd'}
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
                <option value="ZAR">Rand</option>
              </select>
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 px-5">
              <label htmlFor="amount" className="form-label">
                Claim Amount
              </label>

              <input
                type="number"
                className="form-control"
                name="amount"
                id="amount"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <button className="btn btn-info text-white" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

function MultipleTab({ handleMultipleSubmit }) {
  return <form onSubmit={handleMultipleSubmit}>multiple</form>;
}
