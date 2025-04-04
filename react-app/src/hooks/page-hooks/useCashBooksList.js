import { useEffect, useState } from "react";

export default function useCashBooksList() {
  const [shouldShowAddForm, setShouldShowAddForm] = useState(false);
  const [showDetailsFor, setShowDetailsFor] = useState(null);
  const [cashBookToDelete, setCashBookToDelete] = useState(null);
  const [cashBooks, setCashBooks] = useState([]);

  const accountTypes = ["Current Account", "Cash", "Mobile Money"];

  const [loading, setLoading] = useState(false);

  function fetchCashBooks() {
    // axios
    //   .get("/accounting/cash-books/")
    //   .then((res) => {
    //     setCashBooks(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  useEffect(() => {
    fetchCashBooks();
  }, []);

  const handleClose = () => setShouldShowAddForm(false);

  const openCashbookForm = () => setShouldShowAddForm(true);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    setLoading(false);
    // axios
    //   .post("/accounting/cash-books/", data)
    //   .then((res) => {
    //     setLoading(false);
    //     console.log(res);
    //     toast.success("Cashbook added successfully");
    //     fetchCashBooks();
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err);
    //     toast.error(userFriendlyErrorOrResponse(err));
    //   });
  }

  function handleEdit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    setLoading(false);
    // axios
    //   .post("/accounting/cash-books/", data)
    //   .then((res) => {
    //     setLoading(false);
    //     console.log(res);
    //     toast.success("Cashbook added successfully");
    //     fetchCashBooks();
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err);
    //     toast.error(userFriendlyErrorOrResponse(err));
    //   });
  }

  function handleDelete() {
    setCashBookToDelete(null);

    // axios
    //   .delete(`/accounting/cash-books/${cashBookToDelete.id}/`)
    //   .then(() => {
    //     toast.success("Cashbook deleted successfully");
    //     fetchCashBooks();
    //     setCashBookToDelete(null);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast.error(userFriendlyErrorOrResponse(err));
    //   });
  }

  return {
    loading,
    cashBooks,
    accountTypes,
    showDetailsFor,
    cashBookToDelete,
    shouldShowAddForm,
    handleEdit,
    handleClose,
    handleDelete,
    handleSubmit,
    openCashbookForm,
    setShowDetailsFor,
    setCashBookToDelete,
  };
}
