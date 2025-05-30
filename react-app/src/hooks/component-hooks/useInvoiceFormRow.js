import { useState } from "react";

export default function useInvoiceFormRow(item, index, setItems, selectedCurrencyId, salesItems) {
  const [preSelectedSalesItem, setPreSelectedSalesItem] = useState(null);
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);
  const [promptedCurrencyRate, setPromptedCurrencyRate] = useState(1);

  function handleSalesItemSelect(e) {
    const salesItem = salesItems.find((code) => code.item_id === e.target.value);

    if (salesItem.currency_object.id != selectedCurrencyId) {
      setShowCurrencyPrompt(true);
      setPreSelectedSalesItem(salesItem);
      return;
    }

    const taxConf = salesItem.tax_configuration_object;
    const unitVat = ((taxConf?.rate || 0) / 100) * (salesItem?.price || 0);
    const totalVat = unitVat * (item.qty || 0);
    const vatIncTotal = (salesItem?.price || 0) * (item.qty || 0) + totalVat;

    setItems((prev) =>
      prev.map((prevItem, prevIndex) => {
        if (prevIndex === index) {
          return {
            ...prevItem,
            sales_code: salesItem?.item_id || "",
            sales_item: salesItem?.name || "",
            price: (Number(salesItem?.price || 0) + unitVat).toFixed(2) || "",
            vat: taxConf?.rate || 0,
            total: vatIncTotal.toFixed(2),
          };
        } else return prevItem;
      })
    );
  }

  function proceedToHandleSalesItemSelect() {
    const salesItem = { ...preSelectedSalesItem };
    salesItem.price = parseFloat(promptedCurrencyRate) * (parseFloat(salesItem.price) || 0);

    salesItem.unit_price_currency = selectedCurrencyId;

    const taxConf = salesItem.tax_configuration_object;
    const unitVat = (taxConf.rate / 100) * (salesItem?.price || 0);
    const totalVat = unitVat * (item.qty || 0);
    const vatIncTotal = (salesItem?.price || 0) * (item.qty || 0) + totalVat;

    setItems((prev) =>
      prev.map((prevItem, prevIndex) => {
        if (prevIndex === index) {
          return {
            ...prevItem,
            sales_code: salesItem?.item_id || "",
            sales_item: salesItem?.name || "",
            price: (Number(salesItem?.price || 0) + unitVat).toFixed(2) || "",
            vat: taxConf?.rate || 0,
            total: vatIncTotal.toFixed(2),
          };
        } else return prevItem;
      })
    );

    setPreSelectedSalesItem(null);
    setShowCurrencyPrompt(false);
    setPromptedCurrencyRate(1);
  }

  function handleQtyChange(e) {
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
    );
  }

  return {
    handleQtyChange,
    showCurrencyPrompt,
    propmtedCurrencyRate: promptedCurrencyRate,
    preSelectedSalesItem,
    setPreSelectedSalesItem,
    setShowCurrencyPrompt,
    handleSalesItemSelect,
    setPromptedCurrencyRate,
    proceedToHandleSalesItemSelect,
  };
}
