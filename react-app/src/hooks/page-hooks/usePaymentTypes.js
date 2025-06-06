import { useEffect, useState } from "react";

export default function usePaymentTypes() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dev
    // setPaymentTypes([
    //   { type: "Bank Transfer" },
    //   { type: "Cash" },
    //   { type: "Ecocash" },
    //   { type: "POS" },
    // ]);
    // prod
    // fetchPaymentTypes();
  }, []);

  function closeAddModal() {
    setShowAdd(false);
  }

  function openAddModal() {
    setShowAdd(true);
  }

  function handleAddType(e) {
    e.preventDefault();
    console.log(e?.target?.new_type?.value);
    closeAddModal();
    // fetchPaymentTypes();
  }

  function handleDeleteType(type) {
    // axios
    //   .delete(`/accounting/payment-types/${type}/`)
    //   .then(() => {
    //     fetchPaymentTypes();
    //   })
    //   .catch((error) => {
    //     console.log("payment types: " + error.response?.statusText || "");
    //   });
  }

  function fetchPaymentTypes() {
    // setLoading(true);
    // axios
    //   .get("/accounting/payment-types/")
    //   .then((res) => {
    //     setPaymentTypes(res.data);
    //   })
    //   .catch((error) => {
    //     console.log("payment types: " + error.response?.statusText || "");
    //   }).finally(() => {
    //     setLoading(false)
    //  });
  }

  return {
    showAdd,
    loading,
    paymentTypes,
    closeAddModal,
    openAddModal,
    handleAddType,
    handleDeleteType,
  };
}
