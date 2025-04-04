import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/inertia-react";
import html2pdf from "html2pdf.js";

export default function useSalesInvoiceForm(invoice, isProforma) {
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [salesCodes, setSalesCodes] = useState([]);
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [cashBooks, setCashBooks] = useState([]);
  const [key, setKey] = useState(0);
  const [discount, setDiscount] = useState(0);
  const Auth = usePage().props.Auth;
  const [shouldShowSuccessModal, setShouldShowSuccessModal] = useState(false);
  const contentRef = useRef();

  const rep =
    Auth?.user_profile?.first_name ||
    Auth?.user_profile?.last_name ||
    Auth?.user?.email ||
    Auth?.company?.company_name ||
    "N/A";

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

  const [paymentItems, setPaymentItems] = useState([
    {
      paymentType: "",
      cashBook: "",
      detail: "",
      ref: "",
      amountReceived: 0,
    },
    {
      paymentType: "",
      cashBook: "",
      detail: "",
      ref: "",
      amountReceived: 0,
    },
  ]);

  useEffect(() => {
    fetchSalesCodes();
    fetchTaxConfigs();
    fetchPaymentTypes();
    fetchCashBooks();
  }, []);

  function fetchPaymentTypes() {
    // axios
    //   .get("/accounting/payment-types/")
    //   .then((res) => {
    //     setPaymentTypes(res.data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }

  function fetchCashBooks() {
    // axios
    //   .get("/accounting/cash-books/")
    //   .then((res) => {
    //     setCashBooks(res.data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }

  function fetchSalesCodes() {
    axios
      .get("/accounting/items/")
      .then((res) => {
        setSalesCodes(res.data);
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

  function addPaymentItemRow() {
    setPaymentItems((prev) => [
      ...prev,
      {
        paymentType: "",
        cashBook: "",
        detail: "",
        ref: "",
        amountReceived: 0,
      },
    ]);
  }

  function removePaymentItemRow(index) {
    setPaymentItems((prev) =>
      prev.filter((item, i) => {
        if (index === i) {
          return false;
        } else return true;
      })
    );
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
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
    setItems((prev) =>
      prev.filter((item, i) => {
        if (index === i) {
          return false;
        } else return true;
      })
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!items.length) {
      toast.error("Please add at least one item");
      return;
    }
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.items = items.map((item) => {
      const newItem = { ...item };
      newItem.vat =
        ((parseFloat(newItem.vat) || 0) / 100) *
        (parseFloat(newItem.price) || 0) *
        (parseFloat(newItem.qty) || 0);
      delete newItem.static;
      return newItem;
    });

    data.payment_items = paymentItems;

    Object.keys(totals).forEach((key) => (data[key] = totals[key]));
    data.invoiceTotal += Number(discount);
    data.discount = Number(discount);

    console.log(data);

    // dev
    setShouldShowSuccessModal(true);

    // prod
    // axios
    //   .post("/accounting/cash-sales", data)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(userFriendlyErrorOrResponse(err));
    //   });
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
    setCurrency(e.target.value);
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

  const hideSuccessModal = () => setShouldShowSuccessModal(false);

  function printInvoice() {
    // if (!contentRef.current) return;
    // html2pdf()
    //   .from(contentRef.current)
    //   .set({
    //     margin: 0.5,
    //     filename: `invoice-${invoice?.id}.pdf`,
    //     html2canvas: { scale: 2 },
    //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    //   })
    //   .save()
    //   .then(() => {
    //     setShouldShowSuccessModal(false);
    //   });
  }

  return {
    rep,
    key,
    items,
    totals,
    discount,
    currency,
    cashBooks,
    isLoading,
    salesCodes,
    taxConfigs,
    contentRef,
    paymentItems,
    paymentTypes,
    shouldShowSuccessModal,
    addRow,
    setItems,
    onSubmit,
    removeRow,
    printInvoice,
    hideSuccessModal,
    changeCurrency,
    handleDiscount,
    setPaymentItems,
    addPaymentItemRow,
    removePaymentItemRow,
  };
}
