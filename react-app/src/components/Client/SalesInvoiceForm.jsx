import ContentModal from "../ContentModal.jsx";
import useSalesInvoiceForm from "../../hooks/component-hooks/useSalesInvoiceForm.js";
import UserSelector from "../UserSelector.jsx";
import InvoiceFormRow from "./InvoiceFormRow.jsx";
import { Spinner } from "react-bootstrap";
import CustomTable from "./table/CustomTable.jsx";

export function SalesInvoiceForm({ invoice, triggerLabel, triggerVariant, isProforma, onClose }) {
  const {
    key,
    show,
    items,
    totals,
    discount,
    isLoading,
    salesItems,
    currencies,
    taxConfigs,
    invoiceData,
    selectedCurrency,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    handleClose,
    changeCurrency,
    handleDiscount,
    handleUserSelected,
  } = useSalesInvoiceForm(invoice, isProforma, onClose);

  return (
    <>
      <CustomTable.ActionButtonTemplate
        onClick={handleShow}
        icon="add"
        variant={triggerVariant || "info"}
      >
        {triggerLabel || "New"}
      </CustomTable.ActionButtonTemplate>

      <ContentModal
        size="xl"
        show={show}
        handleClose={handleClose}
        title={isProforma ? "PROFORMA" : "FISCAL TAX INVOICE"}
      >
        <form className="p-3 position-relative" onSubmit={onSubmit}>
          <div className="row row-cols-2 pb-3 text-nowrap">
            <div className="col">
              <div className="mb-2 d-flex gap-4 align-items-center justify-content-between">
                <label htmlFor="bill_to" className="form-label">
                  Bill To:
                </label>
                {invoiceData?.bill_to ? (
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    name="customer_id"
                    id="customer_id"
                    readOnly
                    value={invoiceData?.bill_to}
                  />
                ) : (
                  <UserSelector onChange={handleUserSelected} />
                )}
              </div>

              <div className="mb-2 d-flex gap-4 align-items-center">
                <label htmlFor="address" className="form-label">
                  Address:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="address"
                  id="address"
                  placeholder="Address..."
                  defaultValue={invoiceData?.address}
                  readOnly={Boolean(invoiceData?.address)}
                />
              </div>

              <div className="mb-2 d-flex gap-4 align-items-center">
                <label htmlFor="phone" className="form-label">
                  Phone:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="phone"
                  id="phone"
                  placeholder="Phone..."
                  defaultValue={invoiceData?.phone}
                  readOnly={Boolean(invoiceData?.phone)}
                />
              </div>

              <div className="d-flex gap-4 align-items-center">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="email"
                  id="email"
                  placeholder="Email..."
                  defaultValue={invoiceData?.email}
                  readOnly={Boolean(invoiceData?.email)}
                />
              </div>
            </div>

            <div className="col">
              <div className="mb-2 d-flex gap-4 align-items-center">
                <label htmlFor="vat_no" className="form-label">
                  VAT No.:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="vat_no"
                  id="vat_no"
                  placeholder="VAT No...."
                  defaultValue={invoiceData?.vat_no}
                  readOnly={Boolean(invoiceData?.vat_no)}
                />
              </div>

              <div className="mb-2 d-flex gap-4 align-items-center">
                <label htmlFor="tin" className="form-label">
                  TIN:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="tin"
                  id="tin"
                  placeholder="TIN..."
                  defaultValue={invoiceData?.tin}
                  readOnly={Boolean(invoiceData?.tin)}
                />
              </div>

              <div className="d-flex gap-4 align-items-center">
                <label htmlFor="date" className="form-label">
                  Date:
                </label>
                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  max={new Date().toISOString().split("T")[0]}
                  min={new Date(new Date().setDate(1)).toISOString().split("T")[0]}
                  id="date"
                  type="date"
                  readOnly={Boolean(invoiceData)}
                />
              </div>
            </div>
          </div>

          <CustomTable.Table>
            <thead className="text-center">
              <tr>
                <th />
                <th />
                <th />
                <th colSpan={2} className="text-danger">
                  Currency
                </th>
                <th colSpan={2}>
                  <select
                    className="bg-danger form-select shadow-none border-0 form-select-sm text-white"
                    value={selectedCurrency?.id || ""}
                    name="currency_id"
                    id="currency_id"
                    onChange={changeCurrency}
                  >
                    {invoiceData?.currency ? (
                      <option value={invoiceData.currency}>{invoiceData.currency}</option>
                    ) : (
                      <>
                        <option disabled value="">
                          Select Currency
                        </option>
                        {currencies?.map((currency, index) => (
                          <option key={index} value={currency.id}>
                            {currency.currency_code} ({currency.currency_name})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </th>
              </tr>

              <tr>
                <th />
                <th>Sales Item</th>
                <th>Sales Code</th>
                <th>Price (Vat Inc)</th>
                <th>QTY</th>
                <th>VAT</th>
                <th>Total (Vat Inc)</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <InvoiceFormRow
                  key={index + "-" + key}
                  {...{
                    item,
                    index,
                    setItems,
                    removeRow,
                    salesItems,
                    taxConfigs,
                    selectedCurrency,
                    itemsLength: items.length,
                  }}
                />
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td />
                <td>
                  <CustomTable.AddRowButtonTemplate onClick={addRow} label="add row" />
                </td>
                <td className="text-end" colSpan={4}>
                  Total (Excluding VAT)
                </td>
                <td className="text-center">{totals.totalExcludingVat.toFixed(2)}</td>
              </tr>

              <tr>
                <td />
                <td className="text-end" colSpan={5}>
                  Discount
                </td>
                <td>
                  <input
                    className="form-control w-100 form-control-sm d-inline-block text-end"
                    type="number"
                    name="discount"
                    id="discount"
                    vlaue={discount}
                    max={0}
                    step={0.001}
                    onChange={handleDiscount}
                  />
                </td>
              </tr>

              <tr>
                <td />
                <td className="text-end" colSpan={5}>
                  VAT Total
                </td>
                <td className="text-center">{totals.vatTotal.toFixed(2)}</td>
              </tr>

              <tr>
                <td></td>
                <td className="text-end" colSpan={5}>
                  Invoice Total {selectedCurrency?.currency_code || ""}
                </td>
                <td className="text-center">{(totals.invoiceTotal + discount).toFixed(2)}</td>
              </tr>
            </tfoot>
          </CustomTable.Table>

          <div className="text-end">
            <CustomTable.ActionButtonTemplate type="submit">
              Submit
            </CustomTable.ActionButtonTemplate>
          </div>

          {isLoading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-center bg-white bg-opacity-75">
              <Spinner className="mb-5" />
            </div>
          )}
        </form>
      </ContentModal>
    </>
  );
}
