import ContentModal from "../ContentModal.jsx";
import useInvoiceFormRow from "../../hooks/component-hooks/useInvoiceFormRow.js";

export default function InvoiceFormRow({
  item,
  itemName,
  currencies,
  index,
  setItems,
  currency,
  isLoading,
  removeRow,
  salesItems,
  itemsLength,
  taxConfigs,
}) {
  const {
    vatDisplay,
    showCurrencyPrompt,
    propmtedCurrencyRate,
    preSelectedSalesItem,
    setPreSelectedSalesItem,
    setShowCurrencyPrompt,
    handleSalesItemSelect,
    setPromptedCurrencyRate,
    proceedToHandleSalesItemSelect,
  } = useInvoiceFormRow(item, index, setItems, currency, salesItems, taxConfigs);

  return (
    <>
      {showCurrencyPrompt && (
        <ContentModal
          title="Currency Mismatch"
          show={showCurrencyPrompt}
          handleClose={() => {
            setShowCurrencyPrompt(false);
            setPreSelectedSalesItem(null);
            setPromptedCurrencyRate(1);
          }}
          size="md"
        >
          <div>
            <div className="alert alert-danger">
              The item you have selected is listed in{" "}
              {preSelectedSalesItem.currency_object.currency_code} but your {itemName || "invoice"}{" "}
              is to be in {currencies.find((cur) => cur.id == currency) || "_"}, please input below
              the rate to be used
            </div>

            <div className="d-flex gap-3 align-items-center">
              <label className="form-label text-nowrap px-3">
                {`${preSelectedSalesItem.unit_price_currency} to ${currency}`}
              </label>
              <input
                type="number"
                className="form-control"
                value={propmtedCurrencyRate}
                onChange={(e) => setPromptedCurrencyRate(e.target.value)}
              />
            </div>
            <div className="mt-3 text-end">
              <button
                onClick={proceedToHandleSalesItemSelect}
                type="button"
                className="btn btn-info text-white"
              >
                Proceed
              </button>
            </div>
          </div>
        </ContentModal>
      )}

      <tr>
        <td>
          <button
            disabled={item.static || isLoading || itemsLength === 1}
            type="button"
            onClick={() => removeRow(index)}
            className="btn btn-sm btn-danger p-0"
          >
            <i className="material-icons">close</i>
          </button>
        </td>

        <td>
          {item.static ? (
            item.sales_item
          ) : (
            <select
              required
              disabled={isLoading}
              value={item.sales_code}
              onChange={handleSalesItemSelect}
              className="form-select form-select-sm custom-w-2"
            >
              <option disabled value="">
                Select item..
              </option>
              {salesItems.map((item) => (
                <option key={item.id} value={item.item_id}>
                  {`${item.item_id} - ${item.name}`}
                </option>
              ))}
            </select>
          )}
        </td>

        <td>
          <div className="text-center custom-mn-w-1 custom-mx-w-2">
            {item.sales_code} <br />
          </div>
        </td>

        <td>
          <div className="text-center text-nowrap custom-mn-w-1">{item.price || ""}</div>
        </td>

        <td>
          {item.static ? (
            item.qty
          ) : (
            <input
              type="number"
              name="quantity"
              id="quantity"
              className="form-control form-control-sm custom-w-1"
              disabled={isLoading}
              value={item.qty}
              required
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((prevItem, prevIndex) => {
                    if (prevIndex === index) {
                      const qty = parseFloat(e.target.value) || 0;
                      const unitPrice = parseFloat(item.price) || 0;
                      const totalCost = unitPrice * qty;
                      const totalVat = (totalCost * item.vat) / 100;

                      return {
                        ...prevItem,
                        qty: e.target.value,
                        total: totalCost + totalVat,
                      };
                    } else return prevItem;
                  })
                )
              }
            />
          )}
        </td>

        <td>
          <div className="text-center text-nowrap custom-mn-w-1">{vatDisplay}</div>
        </td>

        <td>
          <div className="text-center text-nowrap custom-mn-w-1">
            {(parseFloat(item.total) || 0).toFixed(2)}
          </div>
        </td>
      </tr>
    </>
  );
}
