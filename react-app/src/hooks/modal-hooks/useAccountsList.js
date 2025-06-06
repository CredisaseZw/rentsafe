import axios from "axios";
import { useEffect, useState } from "react";

export default function useAccountsList() {
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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAccountsList();
  }, []);

  const mappableAccountsList = accountsList.sort((a, b) => a.accountNumber - b.accountNumber);

  return {
    mappableAccountsList,
    loading,
  };
}
