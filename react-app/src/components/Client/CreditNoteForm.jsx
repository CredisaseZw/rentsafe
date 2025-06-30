import ContentModal from "../ContentModal.jsx";
import UserSelector from "../UserSelector.jsx";
import InvoiceFormRow from "./InvoiceFormRow.jsx";
import useCreditNoteForm from "../../hooks/component-hooks/useCreditNoteForm.js";
import CustomTable from "./table/CustomTable.jsx";

export function CreditNoteForm({ creditNote }) {
  const {
    key,
    show,
    items,
    totals,
    discount,
    isLoading,
    salesItems,
    taxConfigs,
    creditNoteData,
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
  } = useCreditNoteForm(creditNote);

  return (
    <>
      <CustomTable.ActionButtonTemplate variant="danger" icon="add" onClick={handleShow}>
        New
      </CustomTable.ActionButtonTemplate>

      <ContentModal size="xl" show={show} handleClose={handleClose} title="Credit Note">
        <form className="py-3" onSubmit={onSubmit}>
          <div className="p-4">
            <div className="row row-cols-2 pb-3 text-nowrap">
              <div className="col">
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
                    name="phone"
                    id="phone"
                    placeholder="Phone..."
                    defaultValue={creditNoteData?.phone}
                    readOnly={Boolean(creditNoteData?.phone)}
                  />
                </div>

                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                    name="email"
                    id="email"
                    placeholder="Email..."
                    defaultValue={creditNoteData?.email}
                    readOnly={Boolean(creditNoteData?.email)}
                  />
                </div>
              </div>

              <div className="col">
                <div className="mb-3 d-flex gap-4 align-items-center">
                  <label htmlFor="vat_no" className="form-label">
                    VAT No.:
                  </label>
                  <input
                    className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
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
                        value={selectedCurrency?.id || ""}
                        name="invoice_currency"
                        id="invoice_currency"
                        onChange={changeCurrency}
                      >
                        {creditNoteData?.currency ? (
                          <option value={creditNoteData.currency}>{creditNoteData.currency}</option>
                        ) : (
                          <>
                            <option disabled value="">
                              Select Currency
                            </option>
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
                      itemName: "credit note",
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
                      readOnly={isLoading}
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
                  <td colSpan={5}>Credit Note Total {selectedCurrency?.currency_code || ""}</td>
                  <td>{(totals.creditNoteTotal + discount).toFixed(2)}</td>
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
