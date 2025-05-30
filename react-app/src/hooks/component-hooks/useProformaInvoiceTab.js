import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useProformaInvoiceTab() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = usePage();

  function fetchInvoiceList() {
    setLoading(true);
    axios
      .get("/accounting/invoices/proforma-invoices/")
      .then((res) => setInvoiceList(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchInvoiceList();
  }, [url]);

  function handleFilters(e) {
    e.preventDefault();
    const year = e.target.year.value;
    const month = e.target.month.value;

    const updatesdUrl = new URL(url);
    updatesdUrl.searchParams.set("year", year);
    updatesdUrl.searchParams.set("month", month);

    Inertia.replace(updatesdUrl.href, { preserveState: true });
  }

  return { loading, invoiceList, handleFilters };
}
