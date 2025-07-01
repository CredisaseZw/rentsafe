import { useEffect, useState } from "react";
import { friendlyDate } from "../../utils";
import axios from "axios";

export default function useRecurringInvoicingInvoiceTab() {
  const [loading, setLoading] = useState(false);
  const [invoiceList, setInvoiceList] = useState();

  function fetchRecurringInvoices() {
    setLoading(true);
    axios
      .get("/accounting/invoices/recurring-invoices/")
      .then((res) => {
        console.log(res);
        const invoices = res.data.map((invoice) => ({
          id: invoice.id,
          date_created: friendlyDate(new Date()),
          customer_acc: "",
          customer: invoice.tenant_name,
          bill_to: invoice.tenant_name,
          address: invoice.address,
          phone: "",
          email: "",
          vat_no: "",
          tin: "",
          currency: invoice.lease_currency_type,
          monthly_rental: {
            static: true,
            sales_code: "",
            sales_item: `"Rent - ${invoice.payment_period_start} ${new Date().getMonth() + 1}`,
            price: invoice.owing_amount,
            qty: 1,
            vat_id: "",
            total: invoice.owing_amount,
          },
        }));
        setInvoiceList(invoices);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  return { loading, invoiceList };
}
