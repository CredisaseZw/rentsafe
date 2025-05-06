import { useEffect, useState } from "react";

export default function useRateAuditTrail() {
  const [periodSelectionType, setPeriodSelectionType] = useState("period_selection_type_month");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  function fetchRows() {
    // setRows([
    //   {
    //     date: "2025-03-26",
    //     source: "Invoicing",
    //     user: "Fannuel Mirirayi",
    //     baseUsd: 1,
    //     convertCurrency: "ZWG",
    //     rate: 43,
    //   },
    //   {
    //     date: "2025-03-27",
    //     source: "Invoicing",
    //     user: "Fannuel Mirirayi",
    //     baseUsd: 1,
    //     convertCurrency: "ZWG",
    //     rate: 42,
    //   },
    // ]);
  }

  useEffect(() => {
    fetchRows();
  }, []);

  return {
    rows,
    loading,
    periodSelectionType,
    setPeriodSelectionType,
  };
}
