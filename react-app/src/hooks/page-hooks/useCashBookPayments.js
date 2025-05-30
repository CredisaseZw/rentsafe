import { useForm } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

const rowTemp = {
  id: 1,
  vat: false,
  glAccount: "",
  type: "creditor",
  receiptNumber: "",
  opening_balance_date: "",
  paymentDate: new Date().toISOString().split("T")[0],
  leaseId: undefined,
  creditor: "",
  ref: "",
  details: "",
  currency: "",
  amountOwing: "",
  paidAmount: "",
  netBalance: "",
};

export default function useCashBookPayments() {
  const [rate, setRate] = useState(0);
  const [cashBooks, setCashBooks] = useState([]);
  const [glAccounts, setGlAccounts] = useState([]);
  const [requestCloseFlag, setRequestCloseFlag] = useState(false);
  const [selectedCashBookId, setSelectedCashBookId] = useState("");
  const { data, setData, post, reset, processing } = useForm({
    myKey: "",
    rows: [rowTemp],
  });

  const shouldInputRate = false;

  function fetchCashBooks() {}
  function fetchGlAccounts() {}

  useEffect(() => {
    fetchCashBooks();
    fetchGlAccounts();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const dataToSend = {
      ...data,
      rate,
      selectedCashBookId,
    };

    console.log(dataToSend);

    // axios
    //   .post(reverseUrl("create_disbursement"), payload)
    //   .then((res) => {
    //     console.log(res);
    //     if (res.status === 200 || res.status === 201) {
    //       toast.success(userFriendlyErrorOrResponse(res));
    //       setProcessing(false);
    //       closeModal();
    //       reset();
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setProcessing(false);
    //     setError(userFriendlyErrorOrResponse(err));
    //   });
  }

  function addRow() {
    setData((prev) => ({
      ...prev,
      rows: [...prev.rows, { ...rowTemp, id: new Date().getTime() }],
    }));
  }

  function removeRow(id) {
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((row) => row.id !== id),
    }));
  }

  function handleInputChange(e, id) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === id
          ? {
              ...row,
              [name]: value,
              netBalance:
                name === "paidAmount" ? Number(row.amountOwing) - Number(value) : row.netBalance,
            }
          : row
      ),
    }));
  }

  function handlePaymentAmount(e, id) {
    let { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === id
          ? {
              ...row,
              [name]: value,
              paymentAmount:
                name === "baseAmount"
                  ? Number(row.operatingCost) + Number(row.commission) + Number(value)
                  : name === "operatingCost"
                    ? Number(row.baseAmount) + Number(row.commission) + Number(value)
                    : name === "commission"
                      ? Number(row.baseAmount) + Number(row.operatingCost) + Number(value)
                      : Number(value),
            }
          : row
      ),
    }));
  }

  function handleCreditorSelect(selectedCreditor, index) {
    if (!selectedCreditor) return;
    console.log(selectedCreditor, index);

    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === index
          ? {
              ...row,
              leaseId: selectedCreditor.lease_id,
              creditor: selectedCreditor.landlord_id,
              amountOwing: selectedCreditor.amount,
              paidAmount: "",
              netBalance: selectedCreditor.amount,
            }
          : row
      ),
    }));
  }

  return {
    data,
    rate,
    cashBooks,
    glAccounts,
    processing,
    shouldInputRate,
    requestCloseFlag,
    selectedCashBookId,
    addRow,
    removeRow,
    setRate,
    handleSubmit,
    handleInputChange,
    handlePaymentAmount,
    handleCreditorSelect,
    setSelectedCashBookId,
  };
}
