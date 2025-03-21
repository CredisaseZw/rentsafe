import axios from "axios";
import { truncate } from "lodash";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useCurrencySettings() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    baseCurrency: "",
    conversionCurrency: "",
    rate: "",
    date: new Date().toISOString().split("T")[0],
  });
  const initialDataRef = useRef();

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  useEffect(() => {
    axios
      .get(reverseUrl("rate_setup"))
      .then((res) => {
        // console.log(res);
        const settings = res?.data?.currency_settings;
        if (!settings) return;

        // console.log(settings);
        initialDataRef.current = res;

        setData((prev) => ({
          ...prev,
          rate: settings.current_rate || 0,
          baseCurrency: settings.base_currency || "",
          conversionCurrency: settings.currency || "",
          date:
            settings.updated_at || settings.date_created
              ? new Date(settings.updated_at || settings.date_created).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(initialDataRef);
    console.log(data);
    if (
      initialDataRef.current?.data &&
      data.baseCurrency == initialDataRef.current.data.currency_settings.base_currency &&
      data.conversionCurrency == initialDataRef.current.data.currency_settings.currency &&
      data.rate == initialDataRef.current.data.currency_settings.current_rate
    ) {
      toast.error("no changes were made");
      return;
    }

    axios
      .post(reverseUrl("rate_setup"), {
        base_currency: data.baseCurrency,
        currency: data.conversionCurrency,
        rate: data.rate,
      })
      .then((res) => {
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function setBaseCurrency(val) {
    // if (val === data.conversionCurrency)
    //   toast.error('Cannot have the same base and conversion currency');
    // else setData((prev) => ({ ...prev, baseCurrency: val }));
    setData((prev) => ({
      ...prev,
      baseCurrency: val,
      conversionCurrency: prev.conversionCurrency === val ? "" : prev.conversionCurrency,
    }));
  }

  function setConversionCurrency(val) {
    // if (val === data.baseCurrency)
    //   toast.error('Cannot have the same base and conversion currency');
    // else setData((prev) => ({ ...prev, conversionCurrency: val }));
    setData((prev) => ({
      ...prev,
      conversionCurrency: val,
      baseCurrency: prev.baseCurrency === val ? "" : prev.baseCurrency,
    }));
  }

  return {
    show,
    data,
    setData,
    openModal,
    closeModal,
    handleSubmit,
    setBaseCurrency,
    setConversionCurrency,
  };
}
