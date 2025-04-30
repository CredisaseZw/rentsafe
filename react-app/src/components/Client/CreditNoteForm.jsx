import ContentModal from "../ContentModal.jsx";
import UserSelector from "../UserSelector.jsx";
import InvoiceFormRow from "./InvoiceFormRow.jsx";
import useCreditNoteForm from "../../hooks/component-hooks/useCreditNoteForm.js";

export function CreditNoteForm({ creditNote, triggerClassname, triggerChildren }) {
  const {
    key,
    show,
    items,
    totals,
    discount,
    currency,
    isLoading,
    salesCodes,
    taxConfigs,
    creditNoteData,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    handleClose,
    changeCurrency,
    handleDiscount,
    handleUserSelected,
  } = useCreditNoteForm(creditNote);

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

      <ContentModal size="xl" show={show} handleClose={handleClose} title="Credit Note">
        <form className="py-3" onSubmit={onSubmit}>
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
                    readOnly={Boolean(creditNoteData?.document_number)}
                    defaultValue={creditNoteData?.document_number}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center justify-content-between">
                  <label htmlFor="credit_to" className="form-label">
                    Credit To:
                  </label>
                  {creditNoteData?.credit_to ? (
                    <input
                      className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                      name="customer_id"
                      id="customer_id"
                      readOnly
                      value={creditNoteData?.credit_to}
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
                    defaultValue={creditNoteData?.address}
                    readOnly={Boolean(creditNoteData?.address)}
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
                    defaultValue={creditNoteData?.phone}
                    readOnly={Boolean(creditNoteData?.phone)}
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
                    defaultValue={creditNoteData?.email}
                    readOnly={Boolean(creditNoteData?.email)}
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
                    defaultValue={creditNoteData?.vat_no}
                    readOnly={Boolean(creditNoteData?.vat_no)}
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
                    defaultValue={creditNoteData?.tin}
                    readOnly={Boolean(creditNoteData?.tin)}
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
                    min={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() - 1,
                        new Date().getDate() > 27 ? 27 : new Date().getDate()
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    id="date"
                    type="date"
                    readOnly={Boolean(creditNoteData)}
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
                  <th colSpan={2} className="bg-danger text-white">
                    <div>
                      <select
                        value={currency}
                        name="invoice_currency"
                        id="invoice_currency"
                        onChange={changeCurrency}
                      >
                        {creditNoteData?.currency ? (
                          <option value={creditNoteData.currency}>{creditNoteData.currency}</option>
                        ) : (
                          <>
                            <option value="USD">United States Dollar (USD)</option>
                            <option value="ZIG">Zimbabwean Dollar (ZIG)</option>
                          </>
                        )}
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
                      itemName: "credit note",
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
                    <span>{totals.totalExcludingVat}</span>
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
                      readOnly={isLoading}
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>VAT Total</td>
                  <td>{totals.vatTotal}</td>
                </tr>

                <tr>
                  <td></td>
                  <td colSpan={5}>Credit Note Total {currency}</td>
                  <td>{totals.creditNoteTotal + discount}</td>
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
