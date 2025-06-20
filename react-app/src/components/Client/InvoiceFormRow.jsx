import ContentModal from "../ContentModal.jsx";
import useInvoiceFormRow from "../../hooks/component-hooks/useInvoiceFormRow.js";
import CustomTable from "./table/CustomTable.jsx";

export default function InvoiceFormRow({
  item,
  index,
  setItems,
  itemName,
  removeRow,
  salesItems,
  taxConfigs,
  itemsLength,
  selectedCurrency,
}) {
  if (!selectedCurrency) {
    return (
      <tr>
        <td colSpan={7} className="text-center text-danger p-3">
          Please set a currency for this {itemName || "invoice"}
        </td>
      </tr>
    );
  }

  const {
    showCurrencyPrompt,
    propmtedCurrencyRate,
    preSelectedSalesItem,
    handleQtyChange,
    setShowCurrencyPrompt,
    handleSalesItemSelect,
    setPromptedCurrencyRate,
    setPreSelectedSalesItem,
    proceedToHandleSalesItemSelect,
  } = useInvoiceFormRow(item, index, setItems, selectedCurrency.id, salesItems);

  return (
    <>
      {showCurrencyPrompt && (
        <CurrencyPrompt
          {...{
            itemName,
            selectedCurrency,
            showCurrencyPrompt,
            propmtedCurrencyRate,
            preSelectedSalesItem,
            setShowCurrencyPrompt,
            setPromptedCurrencyRate,
            setPreSelectedSalesItem,
            proceedToHandleSalesItemSelect,
          }}
        />
      )}

      <tr>
        <td>
          <CustomTable.RemoveRowButtonTemplate
            disabled={item.static || itemsLength === 1}
            onClick={() => removeRow(index)}
          />
        </td>

        <td>
          {item.static ? (
            item.sales_item
          ) : (
            <select
              required
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
              value={item.qty}
              required
              onChange={handleQtyChange}
            />
          )}
        </td>

        <td>
          <div className="text-center text-nowrap custom-mn-w-1">
            {item.vat ? item.vat + "%" : ""}
          </div>
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

function CurrencyPrompt({
  itemName,
  selectedCurrency,
  showCurrencyPrompt,
  propmtedCurrencyRate,
  preSelectedSalesItem,
  setShowCurrencyPrompt,
  setPromptedCurrencyRate,
  setPreSelectedSalesItem,
  proceedToHandleSalesItemSelect,
}) {
  return (
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
          {preSelectedSalesItem.currency_object.currency_code} but your {itemName || "invoice"} is
          to be in {selectedCurrency.currency_code}, please input below the rate to be used
        </div>

        <div className="d-flex gap-3 align-items-center">
          <label className="form-label text-nowrap px-3">
            {`${preSelectedSalesItem.unit_price_currency} to ${selectedCurrency.currency_code}`}
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
  );
}
