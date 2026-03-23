import type { TrustAccInvoice } from "@/interfaces";
import { formatAddress, getCurrentDate } from "@/lib/utils";
import React from "react";

interface props {
    bill:TrustAccInvoice
}

const TrustAccBillPrint = React.forwardRef<HTMLDivElement, props>(({ bill }, ref) => {
   
    return (
      <div
        ref={ref}
        className="print-A4 bg-white p-10 text-gray-800"
      >
        <div className="flex justify-between mb-10">
          <div>
           <img src="/fincheck-logo.png" className="w-100 h-auto" alt="Fincheck Logo" />
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">FINCHECK (PVT) LTD</h2>
            <p className="text-sm text-gray-500">8th Floor Club Chambers</p>
            <p className="text-sm text-gray-500">Corner Nelson Mandela and Third Street</p>
            <p className="text-sm text-gray-500">Harare, Zimbabwe</p>
            <p className="text-sm text-gray-500">VAT Number: 220191384</p>
            <p className="text-sm text-gray-500">TIN: 2000032265</p>
            <p className="text-sm text-gray-500">accounts@fincheckzim.com</p>
            <p className="text-sm text-gray-500">(242)-704891/4</p>
          </div>
        </div>
        <div className="text-center w-full">
            <span className="text-center font-bold text-4xl">FISCAL TAX INVOICE</span>
        </div>

        <div className="my-8">
            <p>Document Number: {bill.document_number ?? "-"}</p>
            <p className="font-semibold">Bill To: {bill.tenant?.tenant_object.full_name ?? "-"}</p>
            <p className="text-sm text-gray-600 mt-2">Address: {bill.tenant?.tenant_object.primary_address ? formatAddress(bill.tenant?.tenant_object.primary_address) : "N/A"}</p>
            <p className="text-sm text-gray-600">Phone: {bill.tenant?.tenant_object.phone_number?? "-"}</p>
            <p className="text-sm text-gray-600">Email: {bill.tenant?.tenant_object.email?? "-"}</p>
            <p className="text-sm text-gray-600">VAT No.: {bill.tenant?.tenant_object.vat_number?? "-"}</p>
            <p className="text-sm text-gray-600">TIN: {bill.tenant?.tenant_object.tin_number?? "-"}</p>
            <p className="text-sm text-gray-600 mt-4">Rep: {}</p>
            <p className="text-sm text-gray-600">Date: {getCurrentDate("long")}</p>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead className="border border-gray-600">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">VAT</th>
              <th className="p-2 text-right">Total (Inc)</th>
            </tr>
          </thead>
          <tbody>
            {bill.line_items.map((i, idx) => (
              <tr key={idx} className="border-b border-r border-l border-gray-600">
                <td className="p-2">{i.sales_item_name}</td>
                <td className="p-2 text-right">{i.quantity}</td>
                <td className="p-2 text-right">{i.unit_price}</td>
                <td className="p-2 text-right border-r border-gray-600">${i.vat_amount}</td>
                <td className="p-2 text-right">{i.total_price}</td>
              </tr>
            ))}
            <tr>
                <td colSpan={4} className="p-2 text-right font-semibold">
                    Total (Excluding VAT)
                </td>
                <td className="border border-gray-600 p-2 text-right">
                    {bill.subtotal ?? "-"}
                </td>
            </tr>
            <tr>
                <td colSpan={4} className="p-2 text-right font-semibold">
                    Discount
                </td>
                <td className="border border-gray-600 p-2 text-right">
                    {bill.discount_amount ?? "-" }
                </td>
            </tr>
                        <tr>
                <td colSpan={4} className="p-2 text-right font-semibold">
                   VAT Total
                </td>
                <td className="border border-gray-600 p-2 text-right">
                    {bill.tax_total ?? "-"}
                </td>
            </tr>
                        <tr>
                <td colSpan={4} className="p-2 text-right font-semibold">
                    Invoice Total USD
                </td>
                <td className="border border-gray-600 p-2 text-right">
                  { bill.total_amount ?? "-" }
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

export default TrustAccBillPrint;
