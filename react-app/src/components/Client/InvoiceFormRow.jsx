import { useState } from 'react';

export default function InvoiceFormRow({
  item,
  index,
  itemsLength,
  removeRow,
  isLoading,
  salesCodes,
  setItems,
  taxConfigs,
}) {
  const [selectedSalesCode, setSelectedSalesCode] = useState(null);
  const [selectedTaxConfig, setSelectedTaxConfig] = useState(null);

  function handleSalesCodeSelect(e) {
    const salesCode = salesCodes.find(
      (code) => code.item_id === e.target.value
    );
    const taxConfig = taxConfigs.find(
      (config) => config.id === salesCode.tax_configuration
    );

    const vat = ((taxConfig?.rate || 0) / 100) * (salesCode?.price || 0);

    const total =
      (salesCode?.price || 0) * (item.qty || 0) + vat * (item.qty || 0);

    setItems((prev) =>
      prev.map((prevItem, prevIndex) => {
        if (prevIndex === index) {
          return {
            ...prevItem,
            sales_code: salesCode?.item_id || '',
            sales_item: salesCode?.name || '',
            price: salesCode?.price || '',
            vat: taxConfig?.rate || 0,
            total: total,
          };
        } else return prevItem;
      })
    );

    setSelectedSalesCode(salesCode);
    setSelectedTaxConfig(taxConfig);
  }

  const vatDisplay = selectedTaxConfig?.rate
    ? `${((selectedTaxConfig?.rate || 0) / 100) * (selectedSalesCode?.price || 0)} (${selectedTaxConfig.rate}%)`
    : '';

  return (
    <tr>
      <td>
        <button
          disabled={isLoading || itemsLength === 1}
          type="button"
          onClick={() => removeRow(index)}
          className="btn btn-danger btn-sm p-1"
        >
          <i className="material-icons">close</i>
        </button>
      </td>

      <td>
        <select
          //  name="sales_code"
          //  id="sales_code"
          disabled={isLoading}
          value={item.sales_code}
          onChange={handleSalesCodeSelect}
          className="form-select custom-w-2"
        >
          <option value="">Select code..</option>
          {salesCodes.map((code) => (
            <option key={code.id} value={code.item_id}>
              {`${code.item_id} - ${code.name}`}
            </option>
          ))}
        </select>
      </td>

      <td>
        <div className="text-center custom-mn-w-1 custom-mx-w-2">
          {item.sales_item}
        </div>
      </td>

      <td>
        <div className="text-center text-nowrap custom-mn-w-1">
          {`${
            // selectedSalesCode.unit_price_currency || ''
            ''
          } ${item.price || ''}`}
        </div>
      </td>

      <td>
        <input
          type="number"
          //  name="qty"
          //  id="qty"
          className="form-control custom-w-1"
          disabled={isLoading}
          value={item.qty}
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
      </td>

      <td>
        <div className="text-center text-nowrap custom-mn-w-1">
          {vatDisplay}
        </div>
      </td>

      <td>
        <div className="text-center text-nowrap custom-mn-w-1">
          {item.total}
        </div>
      </td>
    </tr>
  );
}
