import ClientSidebarNavItemModal from "../ClientSidebarNavItemModal.jsx";
import useCashSalesModal from "../../hooks/modal-hooks/useCashSalesModal.js";
import InvoiceFormRow from "../Client/InvoiceFormRow.jsx";
import CashSalesPaymentRow from "../Client/CashSalesPaymentRow.jsx";
import ContentModal from "../ContentModal.jsx";

export default function CashSalesModal(props) {
  const {
    rep,
    key,
    items,
    totals,
    discount,
    cashBooks,
    isLoading,
    salesItems,
    taxConfigs,
    contentRef,
    paymentItems,
    paymentTypes,
    selectedCurrency,
    shouldShowSuccessModal,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    printInvoice,
    hideSuccessModal,
    changeCurrency,
    handleDiscount,
    setPaymentItems,
    addPaymentItemRow,
    removePaymentItemRow,
  } = useCashSalesModal();

  return (
    <>
      <ClientSidebarNavItemModal
        {...props}
        modalProps={{
          // devOnlyDefaultShow: true,
          title: "FISCAL TAX INVOICE",
          navlinkTitle: "Cash Sales",
          size: "xl",
          children: (
            <form className="py-3" onSubmit={onSubmit}>
              <div className="p-4" ref={contentRef}>
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
                      />
                    </div>

                    <div className="mb-3 d-flex gap-4 align-items-center">
                      <label htmlFor="bill_to" className="form-label">
                        Bill To:
                      </label>

                      <input
                        className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                        required
                        name="bill_to"
                        id="bill_to"
                        placeholder="CASH SALE -"
                        defaultValue="CASH SALE - "
                      />
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
                        className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
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
                        className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                        name="tin"
                        id="tin"
                        placeholder="TIN..."
                      />
                    </div>

                    <div className="mb-3 d-flex gap-4 align-items-center">
                      <label htmlFor="rep" className="form-label">
                        Rep:
                      </label>
                      <input
                        className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
                        name="rep"
                        id="rep"
                        value={rep}
                        readOnly
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
                        value={new Date().toISOString().split("T")[0]}
                        id="date"
                        type="date"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <table className="table table-sm table-bordered table-responsive m-0">
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
                            <option disabled value="">
                              Select Currency
                            </option>
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

                    <tr className="border-top-3">
                      <th></th>
                      <th colSpan={5}>
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
                      </th>
                      <th>
                        <span>{totals.totalExcludingVat.toFixed(2)}</span>
                      </th>
                    </tr>

                    <tr>
                      <th></th>
                      <th className="text-end" colSpan={5}>
                        Discount
                      </th>
                      <th>
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
                      </th>
                    </tr>

                    <tr>
                      <th></th>
                      <th className="text-end" colSpan={5}>
                        VAT Total
                      </th>
                      <th>{totals.vatTotal.toFixed(2)}</th>
                    </tr>

                    <tr>
                      <th></th>
                      <th className="text-end" colSpan={5}>
                        Invoice Total {selectedCurrency?.currency_code || ""}
                      </th>
                      <th>{(totals.invoiceTotal + discount).toFixed(2)}</th>
                    </tr>
                  </tbody>

                  <thead className="text-center text-nowrap">
                    <tr>
                      <th></th>
                      <th>Payment Type</th>
                      <th>Cash Book</th>
                      <th>Detail</th>
                      <th>Ref.</th>
                      <th>Amount Received</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {paymentItems.map((paymentItem, index) => (
                      <CashSalesPaymentRow
                        key={index + "-" + key}
                        {...{
                          index,
                          cashBooks,
                          isLoading,
                          paymentItem,
                          paymentTypes,
                          itemsLength: paymentItems.length,
                          setPaymentItems,
                          removePaymentItemRow,
                        }}
                      />
                    ))}

                    <tr className="border-top-3">
                      <td colSpan={7}>
                        <button
                          disabled={isLoading}
                          type="button"
                          className="btn btn-sm btn-outline-info"
                          onClick={addPaymentItemRow}
                        >
                          <i className="leading-icon material-icons">add</i>
                          Add Row
                        </button>
                      </td>
                    </tr>
                  </tbody>
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
          ),
        }}
      />
      {shouldShowSuccessModal && (
        <ContentModal
          size="md"
          title="Invoice Saved"
          show={shouldShowSuccessModal}
          handleClose={hideSuccessModal}
        >
          <div className="text-center">
            <p className="my-4">What action would you like to take?</p>
            <div className="d-flex gap-3 justify-content-center align-items-center">
              <button
                type="button"
                className="btn btn-sm btn-info text-white"
                onClick={printInvoice}
              >
                Print
              </button>
              <button type="button" className="btn btn-sm btn-danger" onClick={hideSuccessModal}>
                No action
              </button>
            </div>
          </div>
        </ContentModal>
      )}
    </>
  );
}
