import axios from "axios";
import toast from "react-hot-toast";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";
import { userFriendlyErrorOrResponse } from "../../utils";
import { set } from "lodash";

export default function useAccountsSectors() {
  const [accountsSectors, setAccountsSectors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target).entries());

    axios
      .post("/accounting/account-sectors/", data)
      .then((res) => {
        setAccountsSectors((prev) => [...prev, res.data]);
        closeAddForm();
      })
      .catch((error) => {
        toast.error("Error adding account sector. " + userFriendlyErrorOrResponse(error));
      })
      .finally(() => setLoading(false));
  }

  return {
    showAdd,
    loading,
    accountsSectors,
    openAddForm,
    closeAddForm,
    handleSubmit,
  };
}
