import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { isNumeric, userFriendlyErrorOrResponse } from "../../utils";

export default function useDisbursements() {
  const [processing, setProcessing] = useState(false);
  const { data, setData, reset } = useForm({
    rows: [{ ...sampleRow }],
  });

  function addRow() {
    const newRow = { ...sampleRow, id: data.rows.length + 1 };
    setData((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
  }

  function removeRow(index) {
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((row, i) => i !== index),
    }));
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "paidAmount" && !isNumeric(value) && value !== "") return;

    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === index
          ? {
              ...row,
              [name]: value,
              netBalance:
                name === "paidAmount" ? Number(row.amountOwing) - Number(value) : row.netBalance,
            }
          : row
      ),
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      disbursements: data.rows.map((row) => ({
        lease_id: row.leaseId,
        date: row.date,
        creditor: row.creditor,
        ref: row.ref,
        details: row.details,
        amount_paid: row.paidAmount,
        amount_owing: row.amountOwing,
        currency: row.currency,
      })),
    };

    console.log({ data, payload });

    axios
      .post(reverseUrl("create_disbursement"), payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          toast.success(userFriendlyErrorOrResponse(res));
          setProcessing(false);
          reset();
        }
      })
      .catch((err) => {
        console.log(err);
        setProcessing(false);
        toast.error(userFriendlyErrorOrResponse(err));
      });
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
    processing,
    addRow,
    removeRow,
    handleSubmit,
    handleInputChange,
    handleCreditorSelect,
  };
}

const sampleRow = {
  leaseId: undefined,
  id: 1,
  date: new Date().toISOString().split("T")[0],
  creditor: "",
  ref: "",
  details: "",
  currency: "",
  amountOwing: "",
  paidAmount: "",
  netBalance: "",
};
