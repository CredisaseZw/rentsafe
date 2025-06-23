import axios from "axios";
import React from "react";
import useCurrencies from "../general-hooks/useCurrencies";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useCurrencySettings() {
  const [loading, setLoading] = React.useState(true);
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [currentSettings, setCurrentSettings] = React.useState({
    id: undefined,
    date_created: undefined,
    date_updated: undefined,
    current_rate: undefined,
    updated_at: undefined,
    user: undefined,
    base_currency: undefined,
    currency: undefined,
  });

  function fetchAndSetCurrentSettings() {
    setLoading(true);
    axios
      .get("/accounting/currency-settings/rate-setup/")
      .then((res) => {
        setCurrentSettings(res.data.currency_rate_settings);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    fetchAndSetCurrentSettings();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target).entries());

    axios
      .post("/accounting/currency-settings/rate-setup/", data)
      .then((res) => {
        toast.success(userFriendlyErrorOrResponse(res));
        fetchAndSetCurrentSettings();
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  function changeHandler(e) {
    const { name, value } = e.target;
    setCurrentSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return {
    loading: loading || currenciesLoading,
    currencies,
    currentSettings,
    changeHandler,
    handleSubmit,
  };
}
