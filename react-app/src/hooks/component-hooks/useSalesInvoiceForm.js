import { useState } from 'react';

export default function useSalesInvoiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [currency, setCurrency] = useState('USD');

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

  function addRow() {
    setItems([
      ...items,
      { salesCode: '', salesItem: '', price: '', qty: '', vat: '', total: '' },
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
    console.log(data);
  }

  function changeHandler(e, index) {
    const { id, value, type } = e.target;
    setItems((prev) =>
      prev.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            [id]: type === 'number' ? parseFloat(value) : value,
          };
        }
        return item;
      })
    );
  }

  const totals = items.reduce(
    (acc, item) => {
      acc.totalExcludingVat +=
        (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0);
      acc.discount += 0;
      acc.vatTotal += parseFloat(item.vat);
      acc.invoiceTotal += parseFloat(item.total);
      return acc;
    },
    {
      totalExcludingVat: 0,
      discount: 0,
      vatTotal: 0,
      invoiceTotal: 0,
    }
  );

  return {
    show,
    items,
    totals,
    currency,
    isLoading,
    addRow,
    onSubmit,
    removeRow,
    handleShow,
    setCurrency,
    handleClose,
    changeHandler,
  };
}
