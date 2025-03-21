import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/inertia-react";
import axios from "axios";
import toast from "react-hot-toast";
import useClientView from "../../hooks/modal-hooks/useClientView.js";
import { Inertia } from "@inertiajs/inertia";
import { truncate } from "lodash";
import { formatCurrency } from "../../utils/formatting.js";
import { userFriendlyErrorOrResponse } from "../../utils/index.js";

export default function useLeaseManagement(leases) {
  const {
    props: { error },
    url,
  } = usePage();

  let totalColor = new URL(url).searchParams.get("color");

  const [details, setDetails] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [terminate, setTerminate] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [subLength, setSubLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sort, setSort] = useState(totalColor ? "rent-owing-des" : "default");
  const clientViewProps = useClientView();
  const [showIndividualLeaseForm, setShowIndividualLeaseForm] = useState(false);
  const [showCompanyLeaseForm, setShowCompanyLeaseForm] = useState(false);

  const viewLeaseId = new URL(usePage().url).searchParams.get("open_view_for");

  useEffect(() => {
    if (!viewLeaseId) return;
    const lease = leases.find((lease) => lease.lease_id == viewLeaseId);
    if (lease) clientViewProps.openClientView(lease);
    else
      clientViewProps.openClientView(
        lease,
        `Lease with ID '${viewLeaseId}' is not included in your current leases.`
      );
  }, [viewLeaseId]);

  useEffect(() => {
    axios
      .post(reverseUrl("open_subscription"))
      .then((res) => {
        setSubscriptions(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [setSubscriptions, isVisible]);

  const hideFooter = document.getElementById("hide-footer");

  useEffect(() => {
    if (hideFooter !== null) {
      document.getElementById("footer").classList.add("d-none");
    }
    return () => {
      if (hideFooter !== null) {
        document.getElementById("footer").classList.remove("d-none");
      }
    };
  }, [hideFooter]);

  switch (totalColor) {
    case "orange":
      totalColor = "warning";
      break;
    case "black":
      totalColor = "black";
      break;
    case "red":
      totalColor = "red";
      break;
    case "green":
      totalColor = "success";
      break;
    case "#991b1b":
      totalColor = "danger";
      break;
    default:
      break;
  }

  if (error) toast.error(userFriendlyErrorOrResponse(error));

  function changeSort(e) {
    setSort(e.target.value);
  }

  let sortFunc = (arr) => arr;

  function writeOff(lease) {
    console.log(lease);
    axios
      .post(reverseUrl("write-off"), { lease_id: lease.lease_id })
      .then((res) => {
        console.log(res);
        Inertia.reload();
      })
      .catch((err) => {
        console.log(err);
        const errMessage = err?.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : JSON.stringify(err);
        toast.error("An error occured:\n" + truncate(errMessage, { length: 200 }));
      });
  }

  switch (sort) {
    case "rent-owing-asc":
      sortFunc = (arr) => {
        const arrClone = [...arr];
        arrClone.sort((a, b) => a.owing_amount - b.owing_amount);
        return arrClone;
      };
      break;
    case "rent-owing-des":
      sortFunc = (arr) => {
        const arrClone = [...arr];
        arrClone.sort((a, b) => b.owing_amount - a.owing_amount);
        return arrClone;
      };
      break;
    case "color-asc":
      sortFunc = (arr) => {
        const arrColors = {};
        arr.forEach((item) => {
          if (item.color in arrColors) {
            arrColors[item.color].push(item);
          } else {
            arrColors[item.color] = [item];
          }
        });

        let arrClone = [];
        Object.keys(arrColors).forEach((key) => {
          arrClone = arrClone.concat(
            arrColors[key].sort((a, b) => a.owing_amount - b.owing_amount)
          );
        });

        return arrClone;
      };
      break;
    case "color-des":
      sortFunc = (arr) => {
        const arrColors = {};
        arr.forEach((item) => {
          if (item.color in arrColors) {
            arrColors[item.color].push(item);
          } else {
            arrColors[item.color] = [item];
          }
        });

        let arrClone = [];
        Object.keys(arrColors).forEach((key) => {
          arrClone = arrClone.concat(
            arrColors[key].sort((a, b) => b.owing_amount - a.owing_amount)
          );
        });

        return arrClone;
      };
      break;
    default:
      sortFunc = (arr) => arr;
      break;
  }

  const [currencySettings, setCurrencySettings] = useState({});
  useEffect(() => {
    axios
      .get(reverseUrl("rate_setup"))
      .then((res) => {
        const settings = res?.data?.currency_settings;
        if (!settings) throw new Error("failed to fetch currency settings");
        setCurrencySettings(settings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const nullCurrencySsettings = Object.keys(currencySettings).length === 0;
  const smartNavigationTotalFormated = !nullCurrencySsettings
    ? `${currencySettings?.base_currency.toUpperCase()} ${formatCurrency(
        leases
          ? leases.reduce((sum, lease) => {
              let amountInBaseCurrency = lease.owing_amount;
              if (
                lease.currency.trim().toLowerCase() !==
                currencySettings?.base_currency.trim().toLowerCase()
              ) {
                amountInBaseCurrency = lease.owing_amount / currencySettings?.current_rate;
              }
              return sum + amountInBaseCurrency;
            }, 0)
          : 0
      ).replace("$", "")}`
    : "";

  const rateText =
    !nullCurrencySsettings &&
    leases &&
    leases.find((l) => l.currency.trim().toLowerCase() !== "usd")
      ? `${currencySettings.base_currency.toUpperCase()} 1 = ${currencySettings.currency.toUpperCase()} ${currencySettings.current_rate}`
      : "";

  const activeLeaseCount = leases?.length
    ? leases.reduce((sum, lease) => {
        if (!lease.terminated) return (sum += 1);
        else return sum;
      }, 0)
    : 0;

  function openReciptFor(lease) {
    setDetails(lease);
    setShowReceipt(true);
  }

  function closeReceipt() {
    setShowReceipt(false);
    setDetails({});
  }

  function terminateLease(lease) {
    setDetails(lease);
    setTerminate(true);
  }

  function closeTerminate() {
    setTerminate(false);
    setDetails({});
  }

  function showIndividualLeaseFormFor(lease) {
    setDetails(lease);
    setShowIndividualLeaseForm(true);
  }

  function closeIndividualLeaseForm() {
    setDetails({});
    setShowIndividualLeaseForm(false);
  }

  function showCompanyLeaseFormFor(lease) {
    setDetails(lease);
    setShowCompanyLeaseForm(true);
  }

  function closeCompanyLeaseForm() {
    setDetails({});
    setShowCompanyLeaseForm(false);
  }

  function showLeaseFormFor(lease, options = { isCompany: false }) {
    if (lease.is_company || options.isCompany) showCompanyLeaseFormFor(lease);
    else showIndividualLeaseFormFor(lease);
  }

  return {
    sort,
    details,
    rateText,
    isVisible,
    subLength,
    terminate,
    totalColor,
    showReceipt,
    subscriptions,
    clientViewProps,
    activeLeaseCount,
    showCompanyLeaseForm,
    showIndividualLeaseForm,
    smartNavigationTotalFormated,
    writeOff,
    sortFunc,
    changeSort,
    setSubLength,
    setIsVisible,
    closeReceipt,
    openReciptFor,
    terminateLease,
    closeTerminate,
    showLeaseFormFor,
    closeCompanyLeaseForm,
    closeIndividualLeaseForm,
  };
}
