import React from 'react';
import { Modal } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import CustomAsyncSelect from '../../CustomAsyncSelect.jsx';
import useReceipt from '../../../hooks/modal-hooks/useReceipt.js';

export default function Receipt({ myKey, show, handleClose, leaseDetails }) {
  const {
    data,
    minDate,
    processing,
    addRow,
    removeRow,
    handleSubmit,
    handleInputChange,
    handleTenantSelect,
    handlePaymentAmount,
  } = useReceipt(myKey, handleClose, leaseDetails);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        centered
      >
        <Modal.Header>
          <div className="w-100 p-4 position-relative">
            <h4 className="text-center">Rent Receipt</h4>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-danger btn-sm position-absolute end-0 top-0 m-3"
            >
              <i className="material-icons">close</i>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <table className="table table-responsive table-bordered table-sm">
              <thead>
                <tr>
                  <th className="text-nowrap"></th>
                  <th className="text-nowrap">Date</th>
                  <th className="text-nowrap">Customer</th>
                  <th className="text-nowrap">Receipt No.</th>
                  <th className="text-nowrap">Details</th>
                  <th className="text-nowrap">Currency</th>
                  <th className="text-nowrap">Amount Owing</th>
                  <th className="text-nowrap">Received Amount</th>
                  <th className="text-nowrap">Amount Balance</th>
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
                        name="paymentDate"
                        min={minDate}
                        max={new Date().toISOString().split('T')[0]}
                        value={row.paymentDate}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                      />
                    </td>

                    <td className="custom-w-2">
                      <CustomAsyncSelect
                        extraProps={{ className: 'w-100', required: true }}
                        url={reverseUrl('get_all_active_leases')}
                        onChange={(selectedOption) =>
                          handleTenantSelect(selectedOption, index)
                        }
                        value={
                          row.tenant
                            ? { label: row.tenant, value: row.lease_id }
                            : null
                        }
                        defaultValue={null}
                        isDisabled={false}
                      />
                    </td>

                    <td>
                      <input
                        onChange={(e) => handleInputChange(e, index)}
                        value={row.receiptNumber}
                        className="form-control"
                        name="receiptNumber"
                        placeholder="..."
                        id="receiptNumber"
                      />
                    </td>

                    <td className="custom-w-170">
                      <input
                        placeholder="..."
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

                    <td
                      style={{
                        backgroundColor:
                          row.color == 'light-red' ? '#f87171' : '',
                      }}
                      className={`bg-${
                        row.color || ''
                      } text-white text-center d-block rounded border border-white border-3`}
                    >
                      <div className="mt-2">{row.rent_owing}</div>
                    </td>

                    <td>
                      <input
                        required
                        name="paymentAmount"
                        // placeholder="0.00"
                        // type="number"
                        // min={0}
                        value={row.paymentAmount}
                        onChange={(e) => handleInputChange(e, index)}
                        className={
                          row.isVariable
                            ? 'form-control border-2 custom-no-pointer-events'
                            : 'form-control'
                        }
                        readOnly={row.isVariable}
                      />

                      {row.isVariable && (
                        <div className="mt-1">
                          <div className="mb-1">
                            <label className="small form-label">Rent</label>
                            <input
                              name="baseAmount"
                              className="form-control form-control-sm"
                              // type="number"
                              // min={0}
                              value={row.baseAmount}
                              onChange={(e) => handlePaymentAmount(e, index)}
                            />
                          </div>

                          {/* <div className="mb-1">
                            <label className="small form-label">
                              Commission
                            </label>
                            <input
                              name="commission"
                              className="form-control form-control-sm"
                              // type="number"
                              // min={0}
                              value={row.commission}
                              onChange={(e) => handlePaymentAmount(e, index)}
                            />
                          </div> */}

                          <div className="mb-1">
                            <label className="small form-label">OPC</label>
                            <input
                              name="operatingCost"
                              className="form-control form-control-sm"
                              // type="number"
                              // min={0}
                              value={row.operatingCost}
                              onChange={(e) => handlePaymentAmount(e, index)}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    <td>
                      <input
                        name="accountBalance"
                        value={Number(
                          (
                            Number(row.rent_owing) - Number(row.paymentAmount)
                          ).toFixed(2)
                        )}
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
                className="btn btn-success"
                onClick={addRow}
              >
                <i className="leading-icon material-icons">add</i>
                Add Receipts
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
