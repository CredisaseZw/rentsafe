import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useSalesInvoiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [salesCodes, setSalesCodes] = useState([]);
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [key, setKey] = useState(0);
  const [items, setItems] = useState([
    {
      sales_code: '',
      sales_item: '',
      price: '',
      qty: '',
      vat: '',
      total: '',
    },
  ]);

  function fetchSalesCodes() {
    axios
      .get('/accounting/items/')
      .then((res) => {
        setSalesCodes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchTaxConfigs() {
    axios
      .get('/accounting/vat-settings/')
      .then((res) => {
        setTaxConfigs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchSalesCodes();
    fetchTaxConfigs();
  }, []);

  function addRow() {
    setItems([
      ...items,
      {
        sales_code: '',
        sales_item: '',
        price: '',
        qty: '',
        vat: '',
        total: '',
      },
    ]);
  }

  function removeRow(index) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  }

  function handleShow() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.items = items;
    console.log(data);
  }

  const totals = items.reduce(
    (acc, item) => {
      const qty = parseFloat(item.qty) || 0;
      const unitVat = (parseFloat(item.vat) || 0) / 100;
      const unitPrice = parseFloat(item.price) || 0;
      acc.totalExcludingVat += unitPrice * qty;
      acc.discount += 0;
      acc.vatTotal += unitPrice * unitVat * qty;
      acc.invoiceTotal += parseFloat(item.total) || 0;
      return acc;
    },
    {
      totalExcludingVat: 0,
      discount: 0,
      vatTotal: 0,
      invoiceTotal: 0,
    }
  );

  function changeCurrency(e) {
    setItems([
      {
        sales_code: '',
        sales_item: '',
        price: '',
        qty: '',
        vat: '',
        total: '',
      },
    ]);
    setCurrency(e.target.value);
    setKey((prev) => prev + 1);
  }

  return {
    key,
    show,
    items,
    totals,
    currency,
    isLoading,
    salesCodes,
    taxConfigs,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    setCurrency,
    handleClose,
    changeCurrency,
  };
}
