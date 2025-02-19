import { Modal } from 'react-bootstrap';
import React from 'react';
import DisbursementsAsyncSelect from '../components/DisbursementsAsyncSelect.jsx';
import useDisbursements from '../hooks/modal-hooks/useDisbursements.js';
import { Toaster } from 'react-hot-toast';
import { truncate } from 'lodash';

export default function Disbursements({
  className,
  id,
  makeActive,
  beforeOpenningModal,
}) {
  const {
    show,
    data,
    processing,
    error,
    addRow,
    setError,
    openModal,
    removeRow,
    handleSubmit,
    handleInputChange,
    handleCreditorSelect,
    closeModal: hookCloseModal,
  } = useDisbursements();

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
        Disbursements
      </a>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        backdrop="static"
        centered
      >
        <Modal.Header>
          <div className="w-100 p-4 position-relative">
            <h4 className="text-center">Disbursements</h4>

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
          {error && (
            <div
              className="alert alert-danger d-flex gap-2 align-items-center"
              role="alert"
            >
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              />
              {truncate(error, { length: 200 })}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <table className="table table-responsive table-bordered table-sm">
              <thead>
                <tr>
                  <th className="text-nowrap"></th>
                  <th className="text-nowrap">Date</th>
                  <th className="text-nowrap">Creditor</th>
                  <th className="text-nowrap">Ref</th>
                  <th className="text-nowrap">Details</th>
                  <th className="text-nowrap">Currency</th>
                  <th className="text-nowrap">Amount Owing</th>
                  <th className="text-nowrap">Paid Amount</th>
                  <th className="text-nowrap">Net Balance</th>
                </tr>
              </thead>

              <tbody>
                {data.rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="px-1 py-0 border-end-0">
                      {data.rows.length > 1 && (
                        <button
                          className="btn btn-close btn-sm mt-3"
                          onClick={() => removeRow(index)}
                        />
                      )}
                    </td>

                    <td>
                      <input
                        className="form-control custom-w-fit"
                        type="date"
                        name="date"
                        value={row.date}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                      />
                    </td>

                    <td className="custom-w-2">
                      <DisbursementsAsyncSelect
                        handleCreditorSelect={handleCreditorSelect}
                        index={index}
                      />
                    </td>

                    <td>
                      <input
                        onChange={(e) => handleInputChange(e, index)}
                        value={row.ref}
                        className="form-control"
                        name="ref"
                        id="ref"
                      />
                    </td>

                    <td className="custom-w-170">
                      <input
                        className="form-control"
                        id="details"
                        name="details"
                        value={row.details}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>

                    <td className="text-center">
                      <div className="mt-2">{row.currency || ''}</div>
                    </td>

                    <td className="text-center">
                      <div className="mt-2">{row.amountOwing || ''}</div>
                    </td>

                    <td>
                      <input
                        required
                        name="paidAmount"
                        value={row.paidAmount}
                        onChange={(e) => handleInputChange(e, index)}
                        className="form-control"
                      />
                    </td>

                    <td>
                      <input
                        name="netBalance"
                        value={Number(row.netBalance).toFixed(2)}
                        readOnly
                        className="form-control custom-no-pointer-events"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-success custom-not-allowed"
                onClick={addRow}
              >
                <i className="leading-icon material-icons">add</i>
                Add Disbursement
              </button>
            </div>

            <div className="p-4 text-center">
              <button type="submit" className="btn btn-info text-white gap-2">
                {processing ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm" />
                    <span>Processing..</span>
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
