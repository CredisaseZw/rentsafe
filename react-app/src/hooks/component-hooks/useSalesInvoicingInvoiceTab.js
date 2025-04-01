import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useSalesInvoicingInvoiceTab() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = usePage();

  function fetchInvoiceList() {
    setLoading(true);
    axios
      .get("/accounting/invoices/")
      .then((res) => {
        console.log(res);
        setInvoiceList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
