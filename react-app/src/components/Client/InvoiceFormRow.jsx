import { useState } from "react";
import ContentModal from "../ContentModal.jsx";

export default function InvoiceFormRow({
  item,
  itemName,
  index,
  setItems,
  currency,
  isLoading,
  removeRow,
  salesCodes,
  itemsLength,
  taxConfigs,
}) {
  const [selectedSalesCode, setSelectedSalesCode] = useState(null);
  const [preSelectedSalesCode, setPreSelectedSalesCode] = useState(null);
  const [selectedTaxConfig, setSelectedTaxConfig] = useState(null);
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);
  const [propmtedCurrencyRate, setPromptedCurrencyRate] = useState(1);

  function handleSalesCodeSelect(e) {
    const salesCode = salesCodes.find((code) => code.item_id === e.target.value);

    if (salesCode.unit_price_currency !== currency) {
      setShowCurrencyPrompt(true);
      setPreSelectedSalesCode(salesCode);
      return;
    }

    const taxConfig = taxConfigs.find((config) => config.id === salesCode.tax_configuration);

    const unitVat = ((taxConfig?.rate || 0) / 100) * (salesCode?.price || 0);
    const totalVat = unitVat * (item.qty || 0);
    const vatIncTotal = (salesCode?.price || 0) * (item.qty || 0) + totalVat;

    setItems((prev) =>
      prev.map((prevItem, prevIndex) => {
        if (prevIndex === index) {
          return {
            ...prevItem,
            sales_code: salesCode?.item_id || "",
            sales_item: salesCode?.name || "",
            price: salesCode?.price || "",
            vat: taxConfig?.rate || 0,
            total: vatIncTotal,
          };
        } else return prevItem;
      })
    );

    setSelectedSalesCode(salesCode);
    setSelectedTaxConfig(taxConfig);
  }

  function proceedToHandleSalesCodeSelect() {
    const salesCode = { ...preSelectedSalesCode };
    salesCode.price = parseFloat(propmtedCurrencyRate) * (parseFloat(salesCode.price) || 0);

    salesCode.unit_price_currency = currency;

    const taxConfig = taxConfigs.find((config) => config.id === salesCode.tax_configuration);

    const unitVat = ((taxConfig?.rate || 0) / 100) * (salesCode?.price || 0);
    const totalVat = unitVat * (item.qty || 0);
    const vatIncTotal = (salesCode?.price || 0) * (item.qty || 0) + totalVat;

    setItems((prev) =>
      prev.map((prevItem, prevIndex) => {
        if (prevIndex === index) {
          return {
            ...prevItem,
            sales_code: salesCode?.item_id || "",
            sales_item: salesCode?.name || "",
            price: salesCode?.price || "",
            vat: taxConfig?.rate || 0,
            total: vatIncTotal,
          };
        } else return prevItem;
      })
    );

    setSelectedSalesCode(salesCode);
    setSelectedTaxConfig(taxConfig);
    setPreSelectedSalesCode(null);
    setShowCurrencyPrompt(false);
    setPromptedCurrencyRate(1);
  }

  const vatDisplay = selectedTaxConfig?.rate
    ? `${((selectedTaxConfig?.rate || 0) / 100) * (selectedSalesCode?.price || 0) * parseFloat(item.qty || 0)} (${selectedTaxConfig.rate}%)`
    : "";

  return (
    <>
      {showCurrencyPrompt && (
        <ContentModal
          title="Currency Mismatch"
          show={showCurrencyPrompt}
          handleClose={() => {
            setShowCurrencyPrompt(false);
            setPreSelectedSalesCode(null);
            setPromptedCurrencyRate(1);
          }}
          size="md"
        >
          <div>
            <div className="alert alert-danger">
              The item you have selected is listed in {preSelectedSalesCode.unit_price_currency} but
              your {itemName || "invoice"} is to be in {currency}, please input below the rate to be
              used
            </div>

            <div className="d-flex gap-3 align-items-center">
              <label className="form-label text-nowrap px-3">
                {`${preSelectedSalesCode.unit_price_currency} to ${currency}`}
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
                onClick={proceedToHandleSalesCodeSelect}
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
            item.sales_code
          ) : (
            <select
              //  name="sales_code"
              //  id="sales_code"
              required
              disabled={isLoading}
              value={item.sales_code}
              onChange={handleSalesCodeSelect}
              className="form-select form-select-sm custom-w-2"
            >
              <option disabled value="">
                Select code..
              </option>
              {salesCodes.map((code) => (
                <option key={code.id} value={code.item_id}>
                  {`${code.item_id} - ${code.name}`}
                </option>
              ))}
            </select>
          )}
        </td>

        <td>
          <div className="text-center custom-mn-w-1 custom-mx-w-2">{item.sales_item}</div>
        </td>

        <td>
          <div className="text-center text-nowrap custom-mn-w-1">
            {`${
              // selectedSalesCode.unit_price_currency || ''
              ""
            } ${item.price || ""}`}
          </div>
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
          <div className="text-center text-nowrap custom-mn-w-1">{item.total}</div>
        </td>
      </tr>
    </>
  );
}
