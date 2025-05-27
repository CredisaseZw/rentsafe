import axios from "axios";
import React from "react";

export default function useSalesInvoiceList() {
  const [invoiceList, setInvoiceList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

  React.useEffect(() => {
    fetchInvoiceList();
  }, []);

  return { loading, invoiceList, reloadInvoices: fetchInvoiceList };
}
