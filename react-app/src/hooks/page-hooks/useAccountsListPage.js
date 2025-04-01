import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

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
          // isEditable: true,
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

    setSubmittedAccs(data);
    setShowConfirmPrompt(true);
  }

  function submitUpdates() {
    console.log("Update accounts", submittedAccs);

    axios
      .put("/accounting/sales-accounts/", submittedAccs)
      .then((res) => {
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
        fetchAccountsList();
      })
      .catch((err) => {
        console.error(err);
        toast.error(userFriendlyErrorOrResponse(err));
      })
      .finally(() => {
        setShowConfirmPrompt(false);
        setSubmittedAccs(null);
      });
  }

  function handleAddition(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("Adding new account", data);

    axios
      .post("/accounting/sales-accounts/", data)
      .then((res) => {
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
        fetchAccountsList();
      })
      .catch((err) => {
        console.error(err);
        toast.error(userFriendlyErrorOrResponse(err));
      })
      .finally(() => {
        setShowNewAccForm(false);
      });
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
