import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

export default function useSalesInvoicingInvoiceTab() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [filteredInvoiceList, setFilteredInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { url } = usePage();
  const searchParams = new URL(url).searchParams;
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const q = searchParams.get("invoice");

  useEffect(() => {
    if (!invoiceList.length) return;
    const filteredInvoiceList = invoiceList
      .map((i) => ({
        date: i.date_created ? new Date(i.date_created) : null,
        invoice: i,
      }))
      .filter((i) =>
        q
          ? `${i.invoice.customer_details?.full_name}###${i.invoice.id}###${i.invoice.currency?.currency_code}`
              .toLowerCase()
              .includes(q.toLowerCase())
          : true
      )
      .filter((i) => (i.date && year ? i.date.getFullYear() === Number(year) : true))
      .filter((i) => (i.date && month ? i.date.getMonth() + 1 === Number(month) : true))
      .map((i) => i.invoice);

    setFilteredInvoiceList(filteredInvoiceList);
  }, [year, month, q, invoiceList.length]);

  function fetchInvoiceList() {
    setLoading(true);
    axios
      .get("/accounting/invoices/")
      .then((res) => {
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
  }, []);

  function applyFilters(e) {
    e.preventDefault();
    const year = e.target.year.value;
    const month = e.target.month.value;

    const updatesdUrl = new URL(url);
    updatesdUrl.searchParams.set("year", year);
    updatesdUrl.searchParams.set("month", month);

    Inertia.replace(updatesdUrl.href, { preserveState: true });
  }

  return { loading, invoiceList: filteredInvoiceList, applyFilters };
}
