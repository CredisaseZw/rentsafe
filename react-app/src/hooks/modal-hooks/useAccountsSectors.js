import axios from "axios";
import { useEffect, useState } from "react";

export default function useAccountsSectors() {
  const [accountsSectors, setAccountsSectors] = useState([]);

  useEffect(() => {
    axios
      .get("/accounting/account-sectors/")
      .then((res) => {
        console.log(res.data);
        setAccountsSectors(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return { accountsSectors };
}
