import toast from "react-hot-toast";
import { useForm } from "@inertiajs/inertia-react";
import { useEffect, useRef } from "react";
import { userFriendlyErrorOrResponse } from "../../utils";
import { Inertia } from "@inertiajs/inertia";

export default function useCurrencySettings(currency_settings, errors, success) {
  const { data, setData, post } = useForm({
    current_rate: currency_settings?.current_rate || 0,
    base_currency: currency_settings?.base_currency || "",
    currency: currency_settings?.currency || "",
    date:
      currency_settings?.updated_at || currency_settings?.date_created
        ? new Date(currency_settings?.updated_at || currency_settings?.date_created)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (errors) toast.error(userFriendlyErrorOrResponse(errors));
    if (success) toast.success(userFriendlyErrorOrResponse(success));
  }, [errors, success]);

  const initialDataRef = useRef(currency_settings);
  // useEffect(() => {
  //   initialDataRef.current = res;
  // }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ initialDataRef, data });
    if (
      initialDataRef.current?.data &&
      data.base_currency == initialDataRef.current.data.currency_settings?.base_currency &&
      data.currency == initialDataRef.current.data.currency_settings?.currency &&
      data.current_rate == initialDataRef.current.data.currency_settings?.current_rate
    ) {
      toast.error("no changes were made");
      return;
    }

    post(reverseUrl("currency_settings"), {
      onError: (err) => {
        console.log(err);
        // toast.error(userFriendlyErrorOrResponse(err));
      },
      onSuccess: Inertia.reload,
    });
  }

  function setBaseCurrency(val) {
    // if (val === data.conversionCurrency)
    //   toast.error('Cannot have the same base and conversion currency');
    // else setData((prev) => ({ ...prev, baseCurrency: val }));
    setData((prev) => ({
      ...prev,
      base_currency: val,
      currency: prev.currency === val ? "" : prev.currency,
    }));
  }

  function setConversionCurrency(val) {
    // if (val === data.baseCurrency)
    //   toast.error('Cannot have the same base and conversion currency');
    // else setData((prev) => ({ ...prev, conversionCurrency: val }));
    setData((prev) => ({
      ...prev,
      currency: val,
      base_currency: prev.base_currency === val ? "" : prev.base_currency,
    }));
  }

  return {
    data,
    setData,
    handleSubmit,
    setBaseCurrency,
    setConversionCurrency,
  };
}
