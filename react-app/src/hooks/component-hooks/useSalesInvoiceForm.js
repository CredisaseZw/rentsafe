import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";
import useCurrencies from "../general-hooks/useCurrencies";

export default function useSalesInvoiceForm(invoice, isProforma, onClose) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [salesItems, setSalesItems] = useState([]);
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [key, setKey] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { currencies, loading: currenciesLoading } = useCurrencies();

  const [items, setItems] = useState([
    {
      static: false,
      sales_code: "",
      sales_item: "",
      price: "",
      qty: "",
      vat: "",
      total: "",
    },
  ]);

  // set currency to first currency if currencies change
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) setSelectedCurrency(currencies[0]);
  }, [currencies.length]);

  useEffect(() => {
    if (invoice) {
      const newInvoiceData = {
        bill_to: invoice.bill_to,
        address: invoice.address,
        phone: invoice.phone,
        email: invoice.email,
        vat_no: invoice.vat_no,
        tin: invoice.tin,
        currency: invoice.currency,
        monthly_rental: invoice.monthly_rental,
      };

      setInvoiceData(newInvoiceData);

      const invCurrency = currencies.find(
        (c) =>
          c.id == newInvoiceData.currency ||
          String(c.currency_code)
            .toLowerCase()
            .includes(String(newInvoiceData.currency).toLowerCase())
      );
      if (invCurrency) setSelectedCurrency(invCurrency);
      else toast.error("could not auto-set invoice currency");

      setItems([newInvoiceData.monthly_rental]);
    }
  }, [invoice]);

  useEffect(() => {
    fetchSalesItems();
    fetchTaxConfigs();
  }, []);

  function fetchSalesItems() {
    axios
      .get("/accounting/items/")
      .then((res) => {
        setSalesItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchTaxConfigs() {
    axios
      .get("/accounting/vat-settings/")
      .then((res) => {
        setTaxConfigs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function addRow() {
    setItems([
      ...items,
      {
        static: false,
        sales_code: "",
        sales_item: "",
        price: "",
        qty: "",
        vat: "",
        total: "",
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
    if (!items.length) {
      toast.error("Please add at least one item");
      return;
    }
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.items = items.map((item) => {
      const newItem = {
        sales_item_id: salesItems.find((i) => (i.name = item.sales_item))?.id || "",
        quantity: item.qty || 1,
        unit_price: item.price,
      };
      return newItem;
    });

    Object.keys(totals).forEach((key) => (data[key] = totals[key]));
    data.invoiceTotal += Number(discount);
    data.discount = Number(discount);
    data.invoice_type = isProforma ? "proforma" : invoice ? "recurring" : "fiscal";
    data.is_individual = data.customer_type === "INDIVIDUAL";

    axios
      .post("/accounting/invoices/", data)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          toast.success(userFriendlyErrorOrResponse("Invoice created successfully"));
          setItems([
            {
              static: false,
              sales_code: "",
              sales_item: "",
              price: "",
              qty: "",
              vat: "",
              total: "",
            },
          ]);
          setDiscount(0);
          setKey((prev) => prev + 1);
          setShow(false);
          if (onClose) onClose();
        } else {
          toast.error(userFriendlyErrorOrResponse(res));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function changeCurrency(e) {
    setItems([
      {
        sales_code: "",
        sales_item: "",
        price: "",
        qty: "",
        vat: "",
        total: "",
      },
    ]);
    const newCurrency = currencies.find((c) => c.id == e.target.value);
    if (newCurrency) {
      setSelectedCurrency(newCurrency);
      setKey((prev) => prev + 1);
    } else toast.error("error selecting currency");
  }

  const totals = items?.reduce(
    (acc, item) => {
      if (!item) return acc;
      const qty = parseFloat(item.qty) || 0;
      const unitVat = (parseFloat(item.vat) || 0) / 100;
      const unitPrice = parseFloat(item.price) || 0;
      acc.totalExcludingVat += unitPrice * qty;
      acc.vatTotal += unitPrice * unitVat * qty;
      acc.invoiceTotal += parseFloat(item.total) || 0;
      return acc;
    },
    {
      totalExcludingVat: 0,
      vatTotal: 0,
      invoiceTotal: 0,
    }
  );

  function handleDiscount(e) {
    let value = parseFloat(e.target.value) || 0;
    if (value > 0) {
      toast.error("Discount should be input as a negative value");
    } else {
      setDiscount(value);
    }
  }

  function handleUserSelected(data) {
    const newInvoiceData = {
      address: data.address,
      phone: data.mobile,
      email: data.email,
      vat_no: data.VAT_number,
      tin: data.tin_number,
    };

    setInvoiceData(newInvoiceData);
  }

  return {
    key,
    show,
    items,
    totals,
    discount,
    salesItems,
    currencies,
    taxConfigs,
    invoiceData,
    selectedCurrency,
    isLoading: isLoading || currenciesLoading,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    handleClose,
    changeCurrency,
    handleDiscount,
    handleUserSelected,
  };
}
