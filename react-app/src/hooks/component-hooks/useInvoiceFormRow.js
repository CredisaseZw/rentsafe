import { useState } from "react";

export default function useInvoiceFormRow(
  item,
  index,
  setItems,
  selectedCurrencyId,
  salesItems,
  taxConfigs
) {
  const [selectedSalesItem, setSelectedSalesItem] = useState(null);
  const [preSelectedSalesItem, setPreSelectedSalesItem] = useState(null);
  const [selectedTaxConfig, setSelectedTaxConfig] = useState(null);
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);
  const [promptedCurrencyRate, setPromptedCurrencyRate] = useState(1);

  function handleSalesItemSelect(e) {
    const salesItem = salesItems.find((code) => code.item_id === e.target.value);

    if (salesItem.currency_object.id != selectedCurrencyId) {
      setShowCurrencyPrompt(true);
      setPreSelectedSalesItem(salesItem);
      return;
    }

    console.log(taxConfigs);
    const taxConfig = taxConfigs.find((config) => config.id === salesItem.tax_configuration);

    const unitVat = ((taxConfig?.rate || 0) / 100) * (salesItem?.price || 0);
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
            vat: taxConfig?.rate || 0,
            total: vatIncTotal.toFixed(2),
          };
        } else return prevItem;
      })
    );

    setSelectedSalesItem(salesItem);
    setSelectedTaxConfig(taxConfig);
  }

  function proceedToHandleSalesItemSelect() {
    const salesItem = { ...preSelectedSalesItem };
    salesItem.price = parseFloat(promptedCurrencyRate) * (parseFloat(salesItem.price) || 0);

    salesItem.unit_price_currency = selectedCurrencyId;

    const taxConfig = taxConfigs.find((config) => config.id === salesItem.tax_configuration);

    const unitVat = ((taxConfig?.rate || 0) / 100) * (salesItem?.price || 0);
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
            vat: taxConfig?.rate || 0,
            total: vatIncTotal.toFixed(2),
          };
        } else return prevItem;
      })
    );

    setSelectedSalesItem(salesItem);
    setSelectedTaxConfig(taxConfig);
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

  const vatDisplay = selectedTaxConfig?.rate
    ? `${(((selectedTaxConfig?.rate || 0) / 100) * (selectedSalesItem?.price || 0) * parseFloat(item.qty || 0)).toFixed(2)} (${selectedTaxConfig.rate}%)`
    : "";

  return {
    vatDisplay,
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
