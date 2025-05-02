import { useEffect, useState } from "react";

export default function useSalesReports() {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [periodSelectionType, setPeriodSelectionType] = useState("period_selection_type_month");
  const [loading, setLoading] = useState(false);
  const [rowsObject, setRowsObject] = useState(undefined);

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

  const totals = {
    consumer_enquiries: rowsObject?.consumer_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    company_enquiries: rowsObject?.company_enquiries.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
    rescission: rowsObject?.rescission.reduce(
      (acc, row) => {
        acc.amountExcl += row.amountExcl;
        acc.vat += row.vat;
        acc.totalInc += row.totalInc;
        return acc;
      },
      { amountExcl: 0, vat: 0, totalInc: 0 }
    ) || { amountExcl: 0, vat: 0, totalInc: 0 },
  };

  return {
    totals,
    loading,
    rowsObject,
    selectedCurrency,
    periodSelectionType,
    setPeriodSelectionType,
    setSelectedCurrency,
  };
}
