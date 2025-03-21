import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { formatCurrency } from "../../../utils/formatting";
import CustomAsyncSelect from "../../CustomAsyncSelect.jsx";
import { Inertia } from "@inertiajs/inertia"; // Make sure you have this import

export default function Receipt({ myKey, show, handleClose, leaseDetails }) {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [lease, setLease] = useState({});
  const [receipts, dispatch] = useReducer(receiptsReducer, []);
  const [redirectKey, setRedirectKey] = useState(null);

  const { data, setData, post, reset } = useForm([]);

  useEffect(() => {
    if (myKey) {
      setRedirectKey(myKey);
    }
  }, [myKey]);

  console.log("leaseDetails", leaseDetails);

  function receiptsReducer(state, action) {
    switch (action.type) {
      case "initialize":
        return [...state, ...action.payload];
      case "updatePaymentAmount":
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              paymentAmount: action.payload.paymentAmount,
            };
          }
          return item;
        });
      case "updatePaymentDate":
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              paymentDate: action.payload.paymentDate,
            };
          }
          return item;
        });
      case "updateReceiptNumber":
        return state.map((item) => {
          if (item.lease_id === action.payload.lease_id) {
            return {
              ...item,
              receiptNumber: action.payload.receiptNumber,
            };
          }
          return item;
        });
      case "updateDetails":
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

  const handleSubmitSub = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading state

    Inertia.post(
      reverseUrl("create_receipt_and_payment"),
      { rows, myKey },
      {
        onSuccess: (response) => {
          if (response.props?.result === "error") {
            toast.error(response.props?.result);
            return;
          }
          handleClose("Receipts created successfully").then(() => {
            reset();
          });
        },
        onError: (errors) => {
          setErrors(errors);
          toast.error("Something went wrong! Please try again");
        },
        onFinish: () => {
          setIsLoading(false);
        },
      }
    );
  };

  // const handleSubmitSub = async (e) => {
  //   e.preventDefault();

  //   post(reverseUrl('create_receipt_and_payment'), { rows },{
  //     // data: rows,
  //     onSuccess: (response) => {
  //       if (response.props?.result === 'error') {
  //         toast.error(response.props?.result);
  //         return;
  //       }
  //       handleClose('Receipts created successfully').then(() => {
  //         reset();
  //       });
  //     },
  //     onError: (errors) => {
  //       setErrors(errors);
  //       toast.error('Something went wrong! Please try again');
  //     },
  //     onFinish: () => {
  //       setIsLoading(false);
  //     },
  //   });
  // };

  const initialRows = [
    {
      id: 1,
      paymentDate: new Date().toISOString().split("T")[0],
      tenant: "",
      receiptNumber: "",
      details: "",
      currency: "",
      rent_owing: "",
      color: "",
      paymentAmount: "",
      accountBalance: "",
      opening_balance_date: "",
    },
  ];

  useEffect(() => {
    if (leaseDetails && leaseDetails.owing_amount) {
      setRows([
        {
          id: 1,
          lease_id: leaseDetails.lease_id,
          paymentDate: new Date().toISOString().split("T")[0],
          tenant: leaseDetails.name,
          receiptNumber: "",
          details: "",
          currency: leaseDetails.currency,
          rent_owing: leaseDetails.owing_amount,
          color: leaseDetails.color,
          paymentAmount: "",
          accountBalance: leaseDetails.owing_amount,
          opening_balance_date: leaseDetails.opening_balance_date,
        },
      ]);
    }
  }, [leaseDetails]);

  // useEffect(() => {
  //   if (leaseDetails) {
  //     const fetchLeaseDetails = async () => {
  //       try {
  //         const response = await axios.get(reverseUrl(`get-lease-details?id=${leaseDetails.id}`));
  //         const lease = response.data.result;
  //         setRows([
  //           {
  //             id: 1,
  //             paymentDate: new Date().toISOString().split('T')[0],
  //             tenant: lease.tenant,
  //             receiptNumber: '',
  //             details: '',
  //             currency: lease.currency,
  //             rent_owing: lease.rent_owing,
  //             color: lease.color,
  //             paymentAmount: '',
  //             accountBalance: lease.account_balance,
  //           },
  //         ]);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     fetchLeaseDetails();
  //   }
  // }, [leaseDetails]);

  // Define initial state with an empty array for rows
  // Initialize state with two default rows
  const [rows, setRows] = useState(initialRows);

  // Handle adding a new row
  const addRow = () => {
    // Create a new row object (you can customize this as needed)
    const newRow = {
      id: rows.length + 1,
      paymentDate: new Date().toISOString().split("T")[0],
      customerType: "",
      customerName: "",
      details: "",
      accountBalance: "",
      endBalance: "",
      opening_balance_date: "",
    };

    // Update the state with the new row
    setRows([...rows, newRow]);
  };

  // Handle input changes in each row
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRows = [...rows];
    newRows[index][name] = value;

    // Recalculate accountBalance if paymentAmount is updated
    if (name === "paymentAmount") {
      const rentOwing = parseFloat(newRows[index].rent_owing) || 0;
      const paymentAmount = parseFloat(value) || 0;
      newRows[index].accountBalance = rentOwing - paymentAmount;
    }

    if (name === "paymentDate") {
      const selectedDate = new Date(newRows[index].paymentDate);
      const openingBalanceDate = new Date(newRows[index].opening_balance_date);
      const maxDate = new Date(new Date().toISOString().split("T")[0]);
      if (selectedDate < openingBalanceDate) {
        toast.error(
          `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
        );
        return;
      }

      if (selectedDate > maxDate) {
        toast.error(
          `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
        );
        return;
      }
    }

    setRows(newRows);
  };

  // const handleFullNameChange = ( option) => {
  //   if (option !== null) {
  //     // setData({ ...data, policy_holder: option.label })
  //     // const { name, value } = e.target;

  //     console.log("option", option)

  //     // const newRows = [...rows];
  //     // newRows[index][name] = value;
  //     // setRows(newRows);
  //   }
  //   console.log("Selected option in parent component:", option)
  // }
  // Handle tenant selection using CustomAsyncSelect
  //  const handleTenantSelect = (selectedOption, index) => {
  //   if (!selectedOption) return; // If nothing is selected, do nothing

  //   const selectedTenantData = selectedOption; // The full tenant data from the CustomAsyncSelect component

  //   const newRows = [...rows];
  //   newRows[index].tenant = selectedTenantData.tenant; // Update tenant name
  //   newRows[index].lease_id = selectedTenantData.lease_id; // Update lease ID
  //   newRows[index].currency = selectedTenantData.Currency; // Update currency
  //   newRows[index].rent_owing = selectedTenantData.rent_owing; // Update rent owing
  //   newRows[index].accountBalance = selectedTenantData.balance_amount; // Update account balance
  //   newRows[index].color = selectedTenantData.color; // Update color if needed

  //   setRows(newRows); // Update the state
  // };

  const handleTenantSelect = (selectedTenantData, index) => {
    if (!selectedTenantData) return;

    const newRows = [...rows];

    // Find the previous row with the same tenant
    const previousTenantRow = newRows
      .slice(0, index)
      .reverse()
      .find((row) => row.tenant === selectedTenantData.tenant);

    // Set rent_owing to accountBalance of the previous tenant row if found, else use rent_owing from the API
    if (previousTenantRow) {
      newRows[index].rent_owing = previousTenantRow.accountBalance;
    } else {
      newRows[index].rent_owing = selectedTenantData.rent_owing;
    }

    newRows[index].tenant = selectedTenantData.tenant; // Update tenant name
    newRows[index].lease_id = selectedTenantData.lease_id; // Update lease ID
    newRows[index].currency = selectedTenantData.Currency; // Update currency
    newRows[index].opening_balance_date = selectedTenantData.opening_balance_date; // Update rent owing
    newRows[index].accountBalance = newRows[index].rent_owing - (newRows[index].paymentAmount || 0); // Calculate initial account balance
    newRows[index].color = selectedTenantData.color; // Update color if needed

    setRows(newRows); // Update the state
  };

  return (
    <div className="container-xl p-5">
      <div className=" ">
        <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
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
                      borderTop: "0px",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  >
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Date
                    </th>

                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Customer
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Receipt No.
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Details
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Currency
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Amount Owing
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Received Amount
                    </th>
                    <th
                      scope="col"
                      style={{
                        borderTop: "1px solid",
                        borderBottom: "1px solid",
                      }}
                    >
                      Amount Balance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td
                        className="tf-borderRight"
                        style={{ paddingRight: "1px", paddingLeft: "1px" }}
                      >
                        <input
                          className="form-control form-control-sm tf-borderRight tf-input"
                          type="date"
                          name="paymentDate"
                          value={row.paymentDate}
                          onChange={(e) => handleInputChange(e, index)}
                          style={{
                            width: "100%",
                            border: "1px solid #111",
                          }}
                        />
                      </td>
                      <td
                        className="tf-borderRight"
                        style={{ paddingRight: "1px", paddingLeft: "1px" }}
                      >
                        <CustomAsyncSelect
                          url={reverseUrl("get_all_active_leases")}
                          onChange={(selectedOption) => handleTenantSelect(selectedOption, index)}
                          value={row.tenant ? { label: row.tenant, value: row.lease_id } : null}
                          defaultValue={null}
                          isDisabled={false}
                        />
                      </td>
                      <td
                        className="tf-borderRight"
                        style={{
                          paddingRight: "1px",
                          paddingLeft: "1px",
                          maxWidth: "60px",
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
                            width: "100%",
                            border: "1px solid #111",
                          }}
                        />
                      </td>
                      <td
                        className="tf-borderRight"
                        style={{ paddingRight: "1px", paddingLeft: "1px" }}
                      >
                        <input
                          className="form-control form-control-sm tf-borderRight tf-input"
                          type="text"
                          id="details"
                          name="details"
                          value={row.details}
                          onChange={(e) => handleInputChange(e, index)}
                          style={{
                            width: "100%",
                            border: "1px solid #111",
                          }}
                        />
                      </td>
                      <td
                        className="tf-borderRight"
                        style={{ paddingRight: "1px", paddingLeft: "1px" }}
                      >
                        {row.currency}
                      </td>
                      <td
                        className={`tf-borderRight bg-${row?.color} text-white text-center`}
                        style={{
                          paddingRight: "1px",
                          paddingLeft: "1px",
                          backgroundColor: row?.color === "light-red" ? "rgb(248, 113, 113)" : "",
                        }}
                        // style={{ paddingRight: '1px', paddingLeft: '1px' }}
                        // style={row?.color === 'light-red' ? { backgroundColor: 'rgb(248, 113, 113)' } : ''}
                        // {row?.color === 'light-red' ? style="background-color: rgb(248, 113, 113);" : style="background-color: rgb(248, 113, 113);"}
                      >
                        {row.rent_owing}
                      </td>
                      <td
                        className="tf-borderRight"
                        style={{ paddingRight: "1px", paddingLeft: "1px" }}
                      >
                        <input
                          type="text"
                          name="paymentAmount"
                          value={row.paymentAmount}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </td>
                      <td
                        className="tf-borderRight text-end"
                        style={{
                          paddingRight: "1px",
                          paddingLeft: "1px",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <input
                          type="text"
                          name="accountBalance"
                          value={row.accountBalance}
                          dissabled={true}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex flex-row-reverse">
                <button
                  className="btn btn-raised bg-success text-white"
                  style={{ backgroundColor: "#0d475c" }}
                  onClick={addRow}
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
                style={{ backgroundColor: "#0d475c" }}
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
      setSelectedLease(leases.find((lease) => lease.lease_id === selectedLease.lease_id));
    }
  }, [leases]);

  return (
    <tr>
      <td className="tf-borderRight" style={{ paddingRight: "1px", paddingLeft: "1px" }}>
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: "updatePaymentDate",
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
          max={new Date().toISOString().split("T")[0]}
          min={
            selectedLease?.opening_balance_date
              ? new Date(selectedLease.opening_balance_date.split("T")?.[0])
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          style={{
            width: "100%",
            border: "1px solid #111",
          }}
        />
      </td>
      <td className="tf-borderRight" style={{ paddingRight: "1px", paddingLeft: "1px" }}>
        <select
          onChange={(e) => {
            setSelectedLease(leases.find((l) => l.lease_id === parseInt(e.target.value)));
          }}
          className="form-control form-control-sm tf-borderRight tf-input"
          name="lease"
          id="lease"
          style={{
            width: "100%",
            border: "1px solid #e0e0e0",
            borderTop: "0px",
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
        style={{ paddingRight: "1px", paddingLeft: "1px", maxWidth: "60px" }}
      >
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: "updateReceiptNumber",
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
            width: "100%",

            border: "1px solid #111",
          }}
        />
      </td>
      <td className="tf-borderRight" style={{ paddingRight: "1px", paddingLeft: "1px" }}>
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: "updateDetails",
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
            width: "100%",
            border: "1px solid #111",
          }}
        />
      </td>
      <td className="tf-borderRight" style={{ paddingRight: "1px", paddingLeft: "1px" }}>
        {selectedLease?.Currency}
      </td>
      <td
        className={`tf-borderRight bg-${selectedLease?.color} text-white text-end`}
        style={{ paddingRight: "1px", paddingLeft: "1px" }}
      >
        {formatCurrency(selectedLease?.rent_owing ?? 0)}
      </td>
      <td className="tf-borderRight" style={{ paddingRight: "1px", paddingLeft: "1px" }}>
        <input
          onChange={(e) =>
            selectedLease &&
            dispatch({
              type: "updatePaymentAmount",
              payload: {
                lease_id: selectedLease.lease_id,
                paymentAmount: Number(e.target.value),
              },
            })
          }
          className="form-control form-control-sm tf-borderRight tf-input"
          name="paymentAmount"
          id="paymentAmount"
          value={selectedLease?.paymentAmount === 0 ? "" : selectedLease?.paymentAmount}
          style={{
            width: "100%",
            border: "1px solid #111",
          }}
        />
      </td>
      <td
        className="tf-borderRight text-end"
        style={{
          paddingRight: "1px",
          paddingLeft: "1px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {selectedLease?.balance_amount
          ? formatCurrency(selectedLease?.balance_amount - selectedLease?.paymentAmount)
          : ""}
      </td>
    </tr>
  );
}
