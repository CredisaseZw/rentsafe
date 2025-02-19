import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils/formatting';

export default function Receipt({ show, handleClose, leaseDetails }) {
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [lease, setLease] = useState({});
  const [receipts, dispatch] = useReducer(receiptsReducer, []);

  const { data, post, reset } = useForm([]);

  console.log('leaseDetails', leaseDetails);

  function receiptsReducer(state, action) {
    switch (action.type) {
      case 'initialize':
        return [...state, ...action.payload];
      case 'updatePaymentAmount':
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              paymentAmount: action.payload.paymentAmount,
            };
          }
          return item;
        });
      case 'updatePaymentDate':
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              paymentDate: action.payload.paymentDate,
            };
          }
          return item;
        });
      case 'updateReceiptNumber':
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              receiptNumber: action.payload.receiptNumber,
            };
          }
          return item;
        });
      case 'updateDetails':
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              details: action.payload.details,
            };
          }
          return item;
        });
      default:
        return state;
    }
  }

  useEffect(() => {
    axios
      .get(reverseUrl('get_all_active_leases'))
      .then((response) => {
        console.log('check', response.data);
        dispatch({
          type: 'initialize',
          payload: response.data?.result?.map((lease) => ({
            ...lease,
            balance_amount: lease.balance_amount,
            paymentAmount: 0,
            paymentDate: new Date().toISOString().split('T')[0],
            receiptNumber: '',
            details: '',
          })),
        });
        setLease({
          ...response.data?.result?.find(
            (lease) => lease.lease_id === leaseDetails.lease_id
          ),
          paymentAmount: 0,
          paymentDate: new Date().toISOString().split('T')[0],
          receiptNumber: '',
          details: '',
        });
      })
      .catch((e) => {
        toast.error(
          'Something went wrong getting tenant details! Please try refreshing the page'
        );
      });
  }, []);
  const handleSubmitSub = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    receipts.forEach((receipt) => {
      if (receipt.paymentAmount > 0) {
        data.push({
          leaseId: receipt.lease_id,
          paymentAmount: receipt.paymentAmount,
          paymentDate: receipt.paymentDate,
          receiptNumber: receipt.receiptNumber,
          details: receipt.details,
        });
      }
    });
    if (lease.paymentAmount > 0) {
      data.push({
        leaseId: lease.lease_id,
        paymentAmount: Number(lease.paymentAmount),
        paymentDate: lease.paymentDate,
        receiptNumber: lease.receiptNumber,
        details: lease.details,
      });
    }

    if (data.length === 0) {
      toast.error('Please add at least one payment');
      return;
    }
    post(reverseUrl('create_receipt_and_payment'), {
      onSuccess: (response) => {
        if (response.props?.result === 'error') {
          toast.error(response.props?.result);
          return;
        }
        handleClose('Receipts created successfully').then(() => {
          reset();
        });
      },
      onError: (errors) => {
        setErrors(errors);
        toast.error('Something went wrong! Please try again');
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="container-xl p-5">
      <div className=" ">
        <Modal
          show={show}
          onHide={handleClose}
          size="xl"
          backdrop="static"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="p-4 d-flex w-100 flex-column justify-content-between align-items-center">
            <div className="table-responsive  w-100 ">
              <div className="flex justify-content-center align-items-center w-100">
                <h5 className="text-center tf-color bg-info">Rent Receipt</h5>
              </div>
              <table className="table table-bordered">
                <thead>
                  <tr
                    style={{
                      borderTop: '0px',
                      fontSize: '12px',
                      width: '100%',
                    }}
                  >
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Date
                    </th>

                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Customer
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Receipt No.
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Details
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Currency
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Amount Owing
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Received Amount
                    </th>
                    <th
                      scope="col"
                      style={{
                        borderTop: '1px solid',
                        borderBottom: '1px solid',
                      }}
                    >
                      Amount Balance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      className="tf-borderRight"
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      <input
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          const maxDate = new Date(
                            new Date().toISOString().split('T')[0]
                          );
                          const minDate = new Date(
                            lease.opening_balance_date.split('T')[0]
                          );

                          // Clear the time portion from the dates
                          selectedDate.setHours(0, 0, 0, 0);
                          maxDate.setHours(0, 0, 0, 0);
                          minDate.setHours(0, 0, 0, 0);

                          if (selectedDate < minDate) {
                            toast.error(
                              `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
                            );
                            return;
                          } else if (selectedDate > maxDate) {
                            toast.error(
                              `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
                            );
                            return;
                          } else {
                            setLease({
                              ...lease,
                              paymentDate: e.target.value,
                            });
                          }
                        }}
                        className="form-control form-control-sm tf-borderRight tf-input"
                        type="date"
                        name="date"
                        id="date"
                        value={lease?.paymentDate}
                        // min={
                        //   lease?.opening_balance_date
                        //     ? new Date(lease.opening_balance_date.split('T')[0]).toISOString().split('T')[0]
                        //     : ''
                        // }
                        // max={new Date().toISOString().split('T')[0]}
                        style={{
                          width: '100%',
                          border: '1px solid #111',
                        }}
                      />
                    </td>
                    <td
                      className="tf-borderRight"
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      {lease?.tenant}
                    </td>
                    <td
                      className="tf-borderRight"
                      style={{
                        paddingRight: '1px',
                        paddingLeft: '1px',
                        maxWidth: '60px',
                      }}
                    >
                      <input
                        onChange={(e) =>
                          setLease({
                            ...lease,
                            receiptNumber: e.target.value,
                          })
                        }
                        className="form-control form-control-sm tf-borderRight tf-input"
                        type="text"
                        name="receiptNumber"
                        id="receiptNumber"
                        value={lease?.receiptNumber}
                        style={{
                          width: '100%',
                          border: '1px solid #111',
                        }}
                      />
                    </td>
                    <td
                      className="tf-borderRight"
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      <input
                        onChange={(e) =>
                          setLease({
                            ...lease,
                            details: e.target.value,
                          })
                        }
                        className="form-control form-control-sm tf-borderRight tf-input"
                        type="text"
                        name="details"
                        id="details"
                        value={lease?.details}
                        style={{
                          width: '100%',
                          border: '1px solid #111',
                        }}
                      />
                    </td>
                    <td
                      className="tf-borderRight"
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      {lease?.Currency}
                    </td>
                    <td
                      className={`tf-borderRight bg-${lease?.color} text-white text-end`}
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      {formatCurrency(lease?.rent_owing)}
                    </td>
                    <td
                      className="tf-borderRight"
                      style={{ paddingRight: '1px', paddingLeft: '1px' }}
                    >
                      <input
                        onChange={(e) => {
                          setLease({
                            ...lease,
                            paymentAmount: e.target.value,
                          });
                        }}
                        className="form-control form-control-sm tf-borderRight tf-input"
                        name="paymentAmount"
                        id="paymentAmount"
                        value={
                          lease?.paymentAmount === 0 ? '' : lease?.paymentAmount
                        }
                        style={{
                          width: '100%',
                          border: '1px solid #111',
                        }}
                      />
                      {errors && (
                        <div className="alert alert-danger" role="alert">
                          {errors?.paymentAmount}
                        </div>
                      )}
                    </td>
                    <td
                      className="tf-borderRight text-end"
                      style={{
                        paddingRight: '1px',
                        paddingLeft: '1px',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      {formatCurrency(
                        lease?.balance_amount - lease?.paymentAmount
                      )}
                    </td>
                  </tr>
                  {numberOfRows > 0 &&
                    Array.from({ length: numberOfRows }, (_, i) => (
                      <ReceiptRow
                        key={i}
                        leases={receipts}
                        dispatch={dispatch}
                      />
                    ))}
                </tbody>
              </table>
              <div className="d-flex flex-row-reverse">
                <button
                  className="btn btn-raised bg-success text-white"
                  style={{ backgroundColor: '#0d475c' }}
                  onClick={() => setNumberOfRows((prev) => prev + 1)}
                >
                  <i className="leading-icon material-icons">add</i>
                  Add Receipts
                </button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="p-4 d-flex justify-content-center">
            <div className="d-flex flex-row-reverse">
              <button
                className="btn btn-raised bg-info text-white"
                style={{ backgroundColor: '#0d475c' }}
                onClick={handleSubmitSub}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm"></span>
                    <span className="ml-2">Processing..</span>
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

function ReceiptRow({ leases, dispatch }) {
  const [selectedLease, setSelectedLease] = useState(null);

  useEffect(() => {
    if (selectedLease) {
      setSelectedLease(
        leases.find((lease) => lease.lease_id === selectedLease.lease_id)
      );
    }
  }, [leases]);

  return (
    <tr>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: 'updatePaymentDate',
              payload: {
                lease_id: selectedLease.lease_id,
                paymentDate: e.target.value,
              },
            })
          }
          className="form-control form-control-sm tf-borderRight tf-input"
          type="date"
          name="date"
          id="date"
          value={selectedLease?.paymentDate}
          max={new Date().toISOString().split('T')[0]}
          min={
            selectedLease?.opening_balance_date
              ? new Date(selectedLease.opening_balance_date.split('T')?.[0])
                  .toISOString()
                  .split('T')[0]
              : ''
          }
          style={{
            width: '100%',
            border: '1px solid #111',
          }}
        />
      </td>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        <select
          onChange={(e) => {
            setSelectedLease(
              leases.find((l) => l.lease_id === parseInt(e.target.value))
            );
          }}
          className="form-control form-control-sm tf-borderRight tf-input"
          name="lease"
          id="lease"
          style={{
            width: '100%',
            border: '1px solid #e0e0e0',
            borderTop: '0px',
          }}
        >
          <option value="">Select Lease</option>
          {leases.map((lease) => (
            <option key={lease.lease_id} value={lease.lease_id}>
              {lease.tenant} - {lease.lease_id}
            </option>
          ))}
        </select>
      </td>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px', maxWidth: '60px' }}
      >
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: 'updateReceiptNumber',
              payload: {
                lease_id: selectedLease.lease_id,
                receiptNumber: e.target.value,
              },
            })
          }
          className="form-control form-control-sm tf-borderRight tf-input"
          name="receiptNumber"
          id="receiptNumber"
          value={selectedLease?.receiptNumber}
          style={{
            width: '100%',

            border: '1px solid #111',
          }}
        />
      </td>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: 'updateDetails',
              payload: {
                lease_id: selectedLease.lease_id,
                receiptNumber: e.target.value,
              },
            })
          }
          className="form-control form-control-sm tf-borderRight tf-input"
          name="details"
          id="details"
          value={selectedLease?.details}
          style={{
            width: '100%',
            border: '1px solid #111',
          }}
        />
      </td>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        {selectedLease?.Currency}
      </td>
      <td
        className={`tf-borderRight bg-${selectedLease?.color} text-white text-end`}
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        {formatCurrency(selectedLease?.rent_owing ?? 0)}
      </td>
      <td
        className="tf-borderRight"
        style={{ paddingRight: '1px', paddingLeft: '1px' }}
      >
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: 'updatePaymentAmount',
              payload: {
                lease_id: selectedLease.lease_id,
                paymentAmount: Number(e.target.value),
              },
            })
          }
          className="form-control form-control-sm tf-borderRight tf-input"
          name="paymentAmount"
          id="paymentAmount"
          value={
            selectedLease?.paymentAmount === 0
              ? ''
              : selectedLease?.paymentAmount
          }
          style={{
            width: '100%',
            border: '1px solid #111',
          }}
        />
      </td>
      <td
        className="tf-borderRight text-end"
        style={{
          paddingRight: '1px',
          paddingLeft: '1px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {selectedLease?.balance_amount
          ? formatCurrency(
              selectedLease?.balance_amount - selectedLease?.paymentAmount
            )
          : ''}
      </td>
    </tr>
  );
}
