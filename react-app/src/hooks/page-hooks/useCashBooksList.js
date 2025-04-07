import { useEffect, useState } from "react";

const sampleCashBooks = [];

// const sampleCashBooks = [
//   {
//     bookId: 1,
//     cashBookName: "Main Cash Book",
//     cashBookCurrency: "USD",
//     bankAccountNumber: "123456789",
//     activeRequisition: true,
//     accountType: "Current Account",
//     branch: "New York",
//     details: "Main operational cash book",
//     generalLedgerAccountNumber: "GL12345",
//   },
//   {
//     bookId: 2,
//     cashBookName: "Petty Cash Book",
//     cashBookCurrency: "USD",
//     accountNumber: "987654321",
//     activeRequisition: false,
//     accountType: "Cash",
//     branch: "Los Angeles",
//     details: "Used for small expenses",
//     generalLedgerAccountNumber: "GL54321",
//   },
//   {
//     bookId: 3,
//     cashBookName: "Savings Cash Book",
//     cashBookCurrency: "USD",
//     accountNumber: "112233445",
//     activeRequisition: false,
//     accountType: "Savings Account",
//     branch: "Chicago",
//     details: "Savings for future projects",
//     generalLedgerAccountNumber: "GL67890",
//   },
// ];

export default function useCashBooksList() {
  const [shouldShowAddForm, setShouldShowAddForm] = useState(false);
  const [showDetailsFor, setShowDetailsFor] = useState(null);
  const [cashBookToDelete, setCashBookToDelete] = useState(null);
  const [cashBooks, setCashBooks] = useState(sampleCashBooks);
  const [generalLedgerAccountNumbers, , setGeneralLedgerAccountNumbers] = useState([]);

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

  function fetchGeneralLedgerAccountNumbers() {}

  useEffect(() => {
    fetchCashBooks();
    fetchGeneralLedgerAccountNumbers();
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

  function changeActiveRequisitionFor(cashBookId, checked) {
    console.log(cashBookId, checked);
  }

  return {
    loading,
    cashBooks,
    accountTypes,
    showDetailsFor,
    cashBookToDelete,
    shouldShowAddForm,
    generalLedgerAccountNumbers,
    handleEdit,
    handleClose,
    handleDelete,
    handleSubmit,
    openCashbookForm,
    setShowDetailsFor,
    setCashBookToDelete,
    changeActiveRequisitionFor,
  };
}
