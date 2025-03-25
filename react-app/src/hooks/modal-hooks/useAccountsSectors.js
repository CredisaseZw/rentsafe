import axios from "axios";
import { useEffect, useState } from "react";

export default function useAccountsSectors() {
  const [accountsSectors, setAccountsSectors] = useState([]);

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

  return { accountsSectors };
}
