import { useState } from "react";
import { friendlyDate } from "../../utils";

export default function useRecurringInvoicingInvoiceTab(recurringInvoices) {
  //   {
  //     "id": 253,
  //     "payment_period_start": "25",
  //     "tenant_name": "ZUVA",
  //     "address": "1512 Cecile Estate",
  //     "reg_number": "15/1999",
  //     "is_company": true,
  //     "owing_amount": 200,
  //     "lease_currency_type": "USD"
  // }
  const [loading, setLoading] = useState(false);
  const [invoiceList, setInvoiceList] = useState(
    recurringInvoices?.map((invoice) => ({
      id: invoice.id,
      date_created: friendlyDate(new Date()),
      customer_acc: "",
      customer: invoice.tenant_name,

      document_number: "",
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
    }))
  );

  return { loading, invoiceList };
}
