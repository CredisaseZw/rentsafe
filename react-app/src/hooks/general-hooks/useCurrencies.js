import axios from "axios";
import React from "react";

export default function useCurrencies() {
  const [currencies, setCurrencies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  function fetchCurrencies() {
    setLoading(true);
    axios
      .get("/accounting/currency")
      .then((res) => {
        setCurrencies(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    fetchCurrencies();
  }, []);

  return {
    loading,
    currencies,
  };
}
