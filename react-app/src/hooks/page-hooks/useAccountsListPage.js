import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useAccountsListPage() {
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [showNewAccForm, setShowNewAccForm] = useState(false);
  const [submittedAccs, setSubmittedAccs] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [adminAccountsList, setAdminAccountsList] = useState([]);
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

  const fetchAdminAccounts = () => {
    // dev
    /*
     const adminAccs = [
       {
         accountName: "Armotisation",
         accountNumber: 30081,
         accountsSector: "S5",
         sectorName: "Expenses",
         isEditable: true,
       },
       {
         accountName: "Cloud charges",
         accountNumber: 30131,
         accountsSector: "S5",
         sectorName: "Expenses",
         isEditable: true,
       },
       {
         accountName: "Mobile expenses",
         accountNumber: 30311,
         accountsSector: "S5",
         sectorName: "Expenses",
         isEditable: true,
       },
      ];
    */
    // prod
    const adminAccs = [];
    setAdminAccountsList(adminAccs);
  };

  useEffect(() => {
    fetchAccountsList();
    fetchAdminAccounts();
  }, []);

  const mappableAccountsList = [...adminAccountsList, ...accountsList].sort(
    (a, b) => a.accountNumber - b.accountNumber
  );

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = Object.fromEntries(new FormData(form));
    const dataArr = {};
    Object.entries(formData).forEach(([key, value]) => {
      const [field, index] = key.split("-");
      if (!dataArr[index]) {
        dataArr[index] = {};
      }
      dataArr[index][field] = value;
    });
    const data = Object.values(dataArr);
    if (data.length === 0) {
      toast.error("No accounts are available to edit/were edited");
      return;
    }
    setSubmittedAccs();
    setShowConfirmPrompt(true);
  }

  function submitUpdates() {
    console.log("Update accounts", submittedAccs);
    setShowConfirmPrompt(false);
    setSubmittedAccs(null);
  }

  function handleAddition(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    console.log("Add new account", formData);
    setShowNewAccForm(false);
  }

  return {
    mappableAccountsList,
    showConfirmPrompt,
    showNewAccForm,
    submittedAccs,
    loading,
    setShowConfirmPrompt,
    setShowNewAccForm,
    handleAddition,
    submitUpdates,
    handleSubmit,
  };
}
