import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useAccountsList() {
  const [accountsList, setAccountsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountsSectors, setAccountsSectors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const closeAddForm = () => setShowAdd(false);
  const openAddForm = () => setShowAdd(true);

  useEffect(() => {
    axios
      .get("/accounting/account-sectors/")
      .then((res) => {
        setAccountsSectors(res.data);
      })
      .catch((error) => {
        console.log("account_sectors: " + error.response?.statusText || "");
      });
  }, []);

  function fetchAccountsList() {
    setLoading(true);
    axios
      .get("/accounting/sales-accounts/")
      .then((res) => {
        const newAccountsList = res.data.map((acc) => ({
          accountName: acc.account_name,
          accountNumber: acc.account_number,
          accountsSector: acc.account_sector_details.name,
          isEditable: false,
        }));

        setAccountsList(newAccountsList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAccountsList();
  }, []);

  const mappableAccountsList = accountsList.sort((a, b) => a.accountNumber - b.accountNumber);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target).entries());

    axios
      .post("/accounting/sales-accounts/", data)
      .then((res) => {
        const newAccount = {
          accountName: res.data.account_name,
          accountNumber: res.data.account_number,
          accountsSector: res.data.account_sector_details.name,
          sectorName: res.data.account_sector,
          isEditable: false,
        };
        setAccountsList((prev) => [...prev, newAccount]);
        closeAddForm();
        toast.success("Account created successfully!");
      })
      .catch((error) => {
        toast.error("Error adding account. " + userFriendlyErrorOrResponse(error));
      })
      .finally(() => setLoading(false));
  }

  function deleteAccount(accountId) {
    setLoading(true);
    axios
      .delete(`/accounting/sales-accounts/${accountId}`)
      .then(() => {
        setAccountsList((prev) => prev.filter((acc) => acc.accountNumber !== accountId));
        toast.success("Account deleted successfully!");
      })
      .catch((error) => {
        toast.error("Error deleting account. " + userFriendlyErrorOrResponse(error));
      })
      .finally(() => setLoading(false));
  }

  function seedAccounts() {
    // setLoading(true);
    // axios
    //   .get(``)
    //   .then((res) => {
    //     console.log(res);
    //     const newAccountsList = res.data.map((acc) => ({
    //       accountName: acc.account_name,
    //       accountNumber: acc.account_number,
    //       accountsSector: acc.account_sector_details.name,
    //       isEditable: false,
    //     }));
    //     setAccountsList(newAccountsList);
    //   })
    //   .catch((error) => {
    //     toast.error("Error fetching accounts. " + userFriendlyErrorOrResponse(error));
    //   })
    //   .finally(() => setLoading(false));
  }

  return {
    loading,
    showAdd,
    accountsSectors,
    mappableAccountsList,
    openAddForm,
    seedAccounts,
    handleSubmit,
    closeAddForm,
    deleteAccount,
  };
}
