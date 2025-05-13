import { useForm } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import { defaultRowCount } from "../../constants";

const rowTemp = {
  id: 1,
  color: "",
  tenant: "",
  details: "",
  currency: "",
  glAccount: "",
  rent_owing: "",
  type: "customer",
  paymentAmount: "",
  receiptNumber: "",
  isVariable: false,
  accountBalance: "",
  opening_balance_date: "",
  paymentDate: new Date().toISOString().split("T")[0],
};

export default function useClientSidebarReceipts() {
  const [rate, setRate] = useState(0);
  const [cashBooks, setCashBooks] = useState([]);
  const [glAccounts, setGlAccounts] = useState([]);
  const [requestCloseFlag, setRequestCloseFlag] = useState(false);
  const [selectedCashBookId, setSelectedCashBookId] = useState("");
  const { data, setData, post, reset, processing } = useForm({
    myKey: "",
    rows: new Array(defaultRowCount).fill(rowTemp).map((row, index) => ({
      ...row,
      id: index + 1 + "-" + new Date().getTime(),
    })),
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
      rows: data.rows.map((row) => ({
        ...row,
        accountBalance: Number(row.accountBalance) - Number(row.paymentAmount),
      })),
      rate,
      selectedCashBookId,
    };

    console.log(dataToSend);

    // post(reverseUrl("create_receipt_and_payment"), {
    //   onBefore: () => console.log(data),
    //   onSuccess: (res) => {
    //     console.log(res);
    //     if (res.props?.result === "error") {
    //       toast.error(res.props?.result);
    //     } else {
    //       toast.success("Receipts created successfully");
    //       reset();
    //       setRequestCloseFlag(true);
    //     }
    //   },
    //   onError: (err) => {
    //     console.log(err);
    //     toast.error("Something went wrong! Please try again: " + JSON.stringify(truncate(err, 15)));
    //   },
    // });
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
      rows: prev.rows.map((row) => (row.id === id ? { ...row, [name]: value } : row)),
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

  function handleTenantSelect(selectedTenantData, id) {
    if (!selectedTenantData) return;
    console.log(selectedTenantData);
    const minDate = new Date(selectedTenantData.opening_balance_date).toISOString().split("T")[0];
    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === id
          ? {
              ...row,
              minDate,
              tenant: selectedTenantData.tenant,
              lease_id: selectedTenantData.lease_id,
              currency: selectedTenantData.Currency,
              opening_balance_date: selectedTenantData.opening_balance_date,
              rent_owing: selectedTenantData.rent_owing,
              accountBalance: selectedTenantData.rent_owing - (row.paymentAmount || ""),
              color: selectedTenantData.color,
              isVariable: selectedTenantData.is_variable,
              ...(selectedTenantData.is_variable
                ? {
                    baseAmount: "",
                    commission: "",
                    operatingCost: "",
                  }
                : {}),
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
    handleTenantSelect,
    handlePaymentAmount,
    setSelectedCashBookId,
  };
}
