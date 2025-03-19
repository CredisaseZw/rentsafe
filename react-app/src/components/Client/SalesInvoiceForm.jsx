import ContentModal from "../ContentModal.jsx";
import useSalesInvoiceForm from "../../hooks/component-hooks/useSalesInvoiceForm.js";
import UserSelector from "../UserSelector.jsx";
import InvoiceFormRow from "./InvoiceFormRow.jsx";

export function SalesInvoiceForm() {
  const {
    key,
    show,
    items,
    totals,
    currency,
    isLoading,
    salesCodes,
    taxConfigs,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    handleClose,
    changeCurrency,
  } = useSalesInvoiceForm();

  return (
    <>
      <button className="btn btn-info text-white" onClick={handleShow}>
        <i className="leading-icon material-icons">add</i>
        New
      </button>

      <ContentModal size="xl" show={show} handleClose={handleClose} title="FISCAL TAX INVOICE">
        <form className="p-3" onSubmit={onSubmit}>
          <div className="p-4 mb-4">
            <div className="pb-5">
              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="document_number" className="form-label">
                  Document Number:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="document_number"
                  id="document_number"
                  placeholder="e.g 112108"
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="bill_to" className="form-label">
                  Bill To:
                </label>
                <UserSelector />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="address" className="form-label">
                  Address:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="address"
                  id="address"
                  placeholder="Address..."
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="phone" className="form-label">
                  Phone:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="phone"
                  id="phone"
                  placeholder="Phone..."
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="email"
                  id="email"
                  placeholder="Email..."
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="vat_no" className="form-label">
                  VAT No.:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="vat_no"
                  id="vat_no"
                  placeholder="VAT No...."
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="tin" className="form-label">
                  TIN:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="tin"
                  id="tin"
                  placeholder="TIN..."
                />
              </div>

              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="date" className="form-label">
                  Date:
                </label>
                <input
                  className="form-control border-0 border-bottom flex-fill border-3 custom-mx-w-4"
                  required
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  max={new Date().toISOString().split("T")[0]}
                  min={new Date(new Date().setDate(1)).toISOString().split("T")[0]}
                  id="date"
                  type="date"
                />
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
                  <th colSpan={2} className="bg-danger text-white">
                    <div>
                      <select
                        value={currency}
                        name="currency"
                        id="currency"
                        onChange={changeCurrency}
                      >
                        <option value="USD">United States Dollar (USD)</option>
                        <option value="ZIG">Zimbabwean Dollar (ZIG)</option>
                      </select>
                    </div>
                  </th>
                </tr>

                <tr>
                  <th></th>
                  <th>Sales Code</th>
                  <th>Sales Item</th>
                  <th>Price(Inc)</th>
                  <th>QTY</th>
                  <th>VAT</th>
                  <th>Total (Inc)</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <InvoiceFormRow
                    key={index + "-" + key}
                    {...{
                      item,
                      index,
                      currency,
                      setItems,
                      removeRow,
                      isLoading,
                      salesCodes,
                      taxConfigs,
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
                        disabled={isLoading}
                        type="button"
                        className="btn btn-outline-info"
                        onClick={addRow}
                      >
                        <i className="leading-icon material-icons">add</i>
                        Add Row
                      </button>
                      Total (Excluding VAT)
                    </div>
                  </td>
                  <td>
                    <span>{totals.totalExcludingVat}</span>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>Discount</td>
                  <td>{totals.discount}</td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>VAT Total</td>
                  <td>{totals.vatTotal}</td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>Invoice Total {currency}</td>
                  <td>{totals.invoiceTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-end">
            <button disabled={isLoading} className="btn btn-info text-white">
              {isLoading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="ms-2">Submitting..</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </ContentModal>
    </>
  );
}
