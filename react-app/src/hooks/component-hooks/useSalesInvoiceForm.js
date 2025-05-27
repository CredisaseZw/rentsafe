import axios from "axios";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";
import useCurrencies from "../general-hooks/useCurrencies";

export default function useSalesInvoiceForm(invoice, isProforma, onClose) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState("");
  const [salesItems, setSalesItems] = useState([]);
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [key, setKey] = useState(0);
  const [discount, setDiscount] = useState(0);
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
    if (currencies.length > 0 && !selectedCurrencyId) {
      setSelectedCurrencyId(currencies[0].id);
    }
  }, [currencies.length]);

  useEffect(() => {
    if (invoice) {
      const newInvoiceData = {
        document_number: invoice.document_number,
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
      setSelectedCurrencyId(newInvoiceData.currency);
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
        qty: item.qty || 1,
        price: item.price,
      };
      return newItem;
    });

    Object.keys(totals).forEach((key) => (data[key] = totals[key]));
    data.invoiceTotal += Number(discount);
    data.discount = Number(discount);
    data.invoice_type = isProforma ? "proforma" : invoice ? "recurring" : "fiscal";
    data.is_individual = data.customer_type === "INDIVIDUAL";

    if (isProforma) {
      console.log("Proforma Invoice Data: ", data);
    } else console.log(data);

    const url = isProforma ? "/accounting/proforma-invoices/" : "/accounting/invoices/";

    axios
      .post(url, data)
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
    setSelectedCurrencyId(e.target.value);
    setKey((prev) => prev + 1);
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
    currencies,
    selectedCurrencyId,
    selectedCurrencyName: currencies.find((c) => c.id == selectedCurrencyId)?.currency_code || "",
    isLoading: isLoading || currenciesLoading,
    salesItems,
    taxConfigs,
    invoiceData,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    handleShow,
    handleClose,
    setDiscount,
    changeCurrency,
    handleDiscount,
    handleUserSelected,
  };
}
