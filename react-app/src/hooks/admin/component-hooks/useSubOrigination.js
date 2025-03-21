import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { userFriendlyErrorOrResponse } from "../../../utils";

export default function useSubOrigination() {
  const { data, setData, reset } = useForm({
    subscriberName: "",
    subscriberRegNo: "",
    product: "",
    subPeriod: "",
    numberOfSubs: "",
    startDate: "",
    currency: "USD",
    monthlyPrice: "",
    monthlyPriceZWL: "",
    subsAmount: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState("");
  const [services, setServices] = useState();
  const [sub_periods, setSubPeriods] = useState();
  const [subscriberType, setSubscriberType] = useState("individual");
  const [subscriberName, setSubscriberName] = useState("");
  const [clientId, setClientId] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit() {
    setIsLoading(true);

    data.subscriberName = subscriberType === "individual" ? String(regNumber) : String(clientId);
    data.subscriberRegNo = String(regNumber);
    data.monthlyPrice =
      data.currency === "USD" ? data.monthlyPrice.toString() : data.monthlyPriceZWL.toString();

    if (data.subscriberName === "") {
      toast.error("Subscriber Name is required", { id: "create-sub" });
      setIsLoading(false);
      return;
    }

    console.log([data]);

    axios
      .post(reverseUrl("active_subcription"), [data])
      .then((res) => {
        console.log(res);
        if (res.data.status === 400) {
          setErrors(res.data.errors[0]);
          toast.error(userFriendlyErrorOrResponse(res), {
            id: "create-sub",
          });
          setIsLoading(false);
          return;
        }
        reset();
        toast.success("Subscription created successfully", {
          id: "create-sub",
        });
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(userFriendlyErrorOrResponse(e?.data?.errors || e), {
          id: "create-sub",
        });
        setErrors(e);
        setIsLoading(false);
      });
  }

  function changeHandler(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  useEffect(() => {
    Promise.all([
      axios.post(reverseUrl("get_services")),
      axios.post(reverseUrl("get_sub_period")),
      axios.post(reverseUrl("subs_monthly_pricing")),
    ]).then((all) => {
      console.log(all[2].data);
      setServices(all[0].data.services);
      setSubPeriods(all[1].data.sub_periods);

      let tempSubsPricing = all[2].data;
      setData((prevData) => ({
        ...prevData,
        monthlyPrice:
          tempSubsPricing?.individual_monthly_price ||
          tempSubsPricing?.company_monthly_price ||
          prevData.monthlyPrice,
        monthlyPriceZWL:
          tempSubsPricing?.individual_zwl_monthly_price ||
          tempSubsPricing?.company_zwl_monthly_price ||
          prevData.monthlyPrice,
      }));
    });
  }, []);

  useEffect(() => {
    if (data.numberOfSubs && data.subPeriod) {
      const periodLength = sub_periods.find(
        (period) => period.id === Number(data.subPeriod)
      ).period_length;
      setData((prevData) => ({
        ...prevData,
        subsAmount:
          data.currency === "USD"
            ? (
                Math.round(
                  Number(data.numberOfSubs) * Number(periodLength) * Number(data.monthlyPrice) * 100
                ) / 100
              ).toString()
            : (
                Math.round(
                  Number(data.numberOfSubs) *
                    Number(periodLength) *
                    Number(data.monthlyPriceZWL) *
                    100
                ) / 100
              ).toString(),
      }));
    }
  }, [data.subPeriod, data.numberOfSubs, data.monthlyPrice, data.monthlyPriceZWL, data.currency]);

  const searchUrl =
    subscriberType === "company"
      ? reverseUrl("get_searched_companies")
      : subscriberType === "individual"
        ? reverseUrl("get_searched_individuals")
        : "";

  isLoading && toast.loading("Creating subscription ...", { id: "create-sub" });

  return {
    data,
    errors,
    services,
    isLoading,
    searchUrl,
    sub_periods,
    subscriberType,
    subscriberName,
    setClientId,
    setRegNumber,
    changeHandler,
    handleSubmit,
    setSubscriberType,
    setSubscriberName,
  };
}
