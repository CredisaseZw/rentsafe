import Layout from "../../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../../components/ContentModal.jsx";
import useCashSales from "../../../../hooks/page-hooks/useCashSales.js";
import NewPageHeader from "../../../../components/NewPageHeader.jsx";
import InvoiceFormRow from "../../../../components/Client/InvoiceFormRow.jsx";
import CashSalesPaymentRow from "../../../../components/Client/CashSalesPaymentRow.jsx";

export default function CashSales() {
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
  } = useCashSales();

  return (
    <>
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

      <NewPageHeader title="Fiscal Tax Invoice" noMargin />

      <form className="p-3 pb-0" onSubmit={onSubmit}>
        <div ref={contentRef}>
          <div className="row row-cols-2 pb-3 text-nowrap">
            <div className="col">
              <div className="mb-3 d-flex gap-4 align-items-center">
                <label htmlFor="bill_to" className="form-label">
                  Bill To:
                </label>

                <input
                  className="form-control form-control-sm border-0 border-bottom flex-fill border-3 "
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
                  name="date"
                  value={new Date().toISOString().split("T")[0]}
                  id="date"
                  type="date"
                  readOnly
                />
              </div>
            </div>
          </div>

          <CustomTable.Table>
            {/* no colgroup looks better */}

            <thead className="text-center">
              <tr>
                <th />
                <th />
                <th />
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

              <tr>
                <th />

                <th>
                  <CustomTable.AddRowButtonTemplate
                    label="add row"
                    disabled={isLoading}
                    onClick={addRow}
                  />
                </th>

                <th colSpan={4} className="text-end">
                  Total (Excluding VAT)
                </th>

                <th className="text-center">{totals.totalExcludingVat.toFixed(2)}</th>
              </tr>

              <tr>
                <th />
                <th className="text-end" colSpan={5}>
                  Discount
                </th>
                <th>
                  <input
                    className="form-control custom-w-1 form-control-sm d-inline-block text-center"
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
                <th />
                <th className="text-end" colSpan={5}>
                  VAT Total
                </th>
                <th className="text-center">{totals.vatTotal.toFixed(2)}</th>
              </tr>

              <tr>
                <th />
                <th className="text-end" colSpan={5}>
                  Invoice Total {selectedCurrency?.currency_code || ""}
                </th>
                <th className="text-center">{(totals.invoiceTotal + discount).toFixed(2)}</th>
              </tr>
            </tbody>

            <thead className="text-center">
              <tr>
                <th />
                <th>Payment Type</th>
                <th>Cash Book</th>
                <th>Detail</th>
                <th>Ref.</th>
                <th>Amount Received</th>
                <th />
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
                  <CustomTable.AddRowButtonTemplate
                    label="Add Row"
                    disabled={isLoading}
                    onClick={addPaymentItemRow}
                  />
                </td>
              </tr>
            </tbody>
          </CustomTable.Table>
        </div>

        <div className="text-end p-3">
          <CustomTable.ActionButtonTemplate disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-grow spinner-grow-sm"></span>
                <span className="ms-2">Submitting..</span>
              </>
            ) : (
              "Submit"
            )}
          </CustomTable.ActionButtonTemplate>
        </div>
      </form>
    </>
  );
}

CashSales.layout = (page) => <Layout children={page} title={"Cash Sales"} />;
