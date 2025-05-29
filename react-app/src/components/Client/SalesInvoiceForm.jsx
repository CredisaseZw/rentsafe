import ContentModal from "../ContentModal.jsx";
import useSalesInvoiceForm from "../../hooks/component-hooks/useSalesInvoiceForm.js";
import UserSelector from "../UserSelector.jsx";
import InvoiceFormRow from "./InvoiceFormRow.jsx";
import { Spinner } from "react-bootstrap";

export function SalesInvoiceForm({
  invoice,
  triggerClassname,
  triggerChildren,
  isProforma,
  onClose,
}) {
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
      <button className={triggerClassname || "btn btn-info text-white"} onClick={handleShow}>
        {triggerChildren || (
          <>
            <i className="leading-icon material-icons">add</i>
            New
          </>
        )}
      </button>

      <ContentModal
        size="xl"
        show={show}
        handleClose={handleClose}
        title={isProforma ? "PROFORMA" : "FISCAL TAX INVOICE"}
      >
        <form className="py-3 position-relative" onSubmit={onSubmit}>
          <div className="p-4">
            <div className="row row-cols-2 pb-3 text-nowrap">
              <div className="col">
                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="document_number" className="form-label">
                    Document Number:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="document_number"
                    id="document_number"
                    placeholder="e.g 112108"
                    readOnly={Boolean(invoiceData?.document_number)}
                    defaultValue={invoiceData?.document_number}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center justify-content-between">
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

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="address" className="form-label">
                    Address:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="address"
                    id="address"
                    placeholder="Address..."
                    defaultValue={invoiceData?.address}
                    readOnly={Boolean(invoiceData?.address)}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="phone" className="form-label">
                    Phone:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="phone"
                    id="phone"
                    placeholder="Phone..."
                    defaultValue={invoiceData?.phone}
                    readOnly={Boolean(invoiceData?.phone)}
                  />
                </div>
              </div>

              <div className="col">
                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="email"
                    id="email"
                    placeholder="Email..."
                    defaultValue={invoiceData?.email}
                    readOnly={Boolean(invoiceData?.email)}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="vat_no" className="form-label">
                    VAT No.:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="vat_no"
                    id="vat_no"
                    placeholder="VAT No...."
                    defaultValue={invoiceData?.vat_no}
                    readOnly={Boolean(invoiceData?.vat_no)}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="tin" className="form-label">
                    TIN:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
                    name="tin"
                    id="tin"
                    placeholder="TIN..."
                    defaultValue={invoiceData?.tin}
                    readOnly={Boolean(invoiceData?.tin)}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="date" className="form-label">
                    Date:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    required
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

            <table className="table table-sm table-bordered table-responsive">
              <thead className="text-center text-nowrap">
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan={2} className="text-danger">
                    Currency
                  </th>
                  <th colSpan={2} className="">
                    <div>
                      <select
                        className="bg-danger text-white py-2 px-4 rounded-3"
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
                    </div>
                  </th>
                </tr>

                <tr>
                  <th></th>
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

              <tfoot className="text-end">
                <tr>
                  <td></td>
                  <td colSpan={5}>
                    <div className="w-100 gap-3 align-items-center d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={addRow}
                      >
                        <i className="leading-icon material-icons">add</i>
                        Add Row
                      </button>
                      Total (Excluding VAT)
                    </div>
                  </td>
                  <td>
                    <span>{totals.totalExcludingVat.toFixed(2)}</span>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>Discount</td>
                  <td>
                    <input
                      style={{ width: "150px" }}
                      className="form-control form-control-sm d-inline-block text-end"
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
                  <td></td>
                  <td colSpan={5}>VAT Total</td>
                  <td>{totals.vatTotal.toFixed(2)}</td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>Invoice Total {selectedCurrency?.currency_code || ""}</td>
                  <td>{(totals.invoiceTotal + discount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-end">
            <button className="btn btn-info text-white">Submit</button>
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
