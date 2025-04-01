import axios from "axios";
import html2pdf from "html2pdf.js";
import { useEffect, useRef, useState } from "react";

export default function useDetailedGeneralLedgerAccount() {
  const [periodSelectionType, setPeriodSelectionType] = useState("period_selection_type_month");
  const [rows, setRows] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [loading, setLoading] = useState(false);

  function fetchAccountsList() {
    setLoading(true);
    axios
      .get("/accounting/sales-accounts/")
      .then((res) => {
        const newAccountsList = res.data.map((acc) => ({
          accountName: acc.account_name,
          accountNumber: acc.account_number,
          accountsSector: acc.account_sector,
          sectorName: acc.account_sector,
          isEditable: false,
        }));

        setAccountsList(newAccountsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchAccountsList();
  }, []);

  const contentRef = useRef();

  const transactionTotals = rows.reduce(
    (totals, row) => {
      totals.debit += row.debit || 0;
      totals.credit += row.credit || 0;
      totals.balance += row.balance || 0;
      return totals;
    },
    { debit: 0, credit: 0, balance: 0 }
  );

  function printContent() {
    console.log(contentRef.current);
    html2pdf()
      .from(contentRef.current)
      .set({
        margin: 1,
        filename: "detailed_general_ledger.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
  }

  return {
    rows,
    loading,
    tableTitle: "Account Number : Name",
    contentRef,
    accountsList,
    transactionTotals,
    periodSelectionType,
    setPeriodSelectionType,
    printContent,
    handleSubmit,
  };
}
