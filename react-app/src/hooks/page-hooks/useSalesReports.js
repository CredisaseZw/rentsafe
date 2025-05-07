import { useEffect, useState } from "react";

export default function useSalesReports() {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [periodSelectionType, setPeriodSelectionType] = useState("period_selection_type_month");
  const [loading, setLoading] = useState(false);
  const [usdRowsObject, setUsdRowsObject] = useState();
  const [zwgRowsObject, setZwgRowsObject] = useState();
  const [rate, setRate] = useState(45);

  function fetchRows() {
    // setLoading(true);
    // Simulate fetching data from an API
    // const fetchedRows = {
    //   consumer_enquiries: [
    //     {
    //       date: "24-Mar-25",
    //       inv: "4000563",
    //       customer: "African Century",
    //       amountExcl: 50.0,
    //       vat: 7.5,
    //       totalInc: 57.5,
    //     },
    //     {
    //       date: "25-Mar-25",
    //       inv: "4000564",
    //       customer: "First Capital Bank",
    //       amountExcl: 7.0,
    //       vat: 1.05,
    //       totalInc: 8.05,
    //     },
    //   ],
    //   company_enquiries: [],
    //   rescission: [
    //     {
    //       date: "28-Feb-25",
    //       inv: "4000565",
    //       customer: "Cash Sale",
    //       amountExcl: 43.48,
    //       vat: 6.52,
    //       totalInc: 50.0,
    //     },
    //   ],
    // };
    // new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
    //   setRowsObject(fetchedRows);
    //   setLoading(false);
    // });
  }

  useEffect(() => {
    fetchRows();
  }, []);

  const usdTotals = {
    consumer_enquiries: usdRowsObject?.consumer_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    company_enquiries: usdRowsObject?.company_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    rescission: usdRowsObject?.rescission.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
  };

  const zwgTotals = {
    consumer_enquiries: zwgRowsObject?.consumer_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    company_enquiries: zwgRowsObject?.company_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    rescission: zwgRowsObject?.rescission.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
  };

  const grandTotals = {
    amountExcl:
      usdTotals.consumer_enquiries.amountExcl +
      usdTotals.company_enquiries.amountExcl +
      usdTotals.rescission.amountExcl +
      (zwgTotals.consumer_enquiries.amountExcl +
        zwgTotals.company_enquiries.amountExcl +
        zwgTotals.rescission.amountExcl) /
        (rate || 1),
    vat:
      usdTotals.consumer_enquiries.vat +
      usdTotals.company_enquiries.vat +
      usdTotals.rescission.vat +
      (zwgTotals.consumer_enquiries.vat +
        zwgTotals.company_enquiries.vat +
        zwgTotals.rescission.vat) /
        (rate || 1),
    totalInc:
      usdTotals.consumer_enquiries.totalInc +
      usdTotals.company_enquiries.totalInc +
      usdTotals.rescission.totalInc +
      (zwgTotals.consumer_enquiries.totalInc +
        zwgTotals.company_enquiries.totalInc +
        zwgTotals.rescission.totalInc) /
        (rate || 1),
  };

  return {
    rate,
    loading,
    zwgTotals,
    usdTotals,
    grandTotals,
    zwgRowsObject,
    usdRowsObject,
    selectedCurrency,
    periodSelectionType,
    setPeriodSelectionType,
    setSelectedCurrency,
  };
}
