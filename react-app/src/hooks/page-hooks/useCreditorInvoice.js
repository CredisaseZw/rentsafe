import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { defaultRowCount } from "../../constants";

export default function useCreditorInvoice() {
  const [creditorInvoices, setCreditorInvoices] = useState([]);
  const [rows, setRows] = useState(
    new Array(defaultRowCount).fill({
      date: new Date().toISOString().split("T")[0],
      creditor: "",
      details: "",
      inv_ref: "",
      gl_acc_number: "",
      currency: "",
      total_amount_inc: 0,
      vat: 0,
      net_amount_excl: 0,
      rate: 0,
    })
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { url } = usePage();
  const [glAccounts, setGlAccounts] = useState([]);
  const [vatOptions, setVatOptions] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState(undefined);

  function fetchBaseCurrency() {
    axios
      .get(reverseUrl("rate_setup"))
      .then((res) => {
        const settings = res?.data?.currency_settings;
        if (!settings) return;
        setBaseCurrency(settings.base_currency);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchCreditorInvoices() {
    // axios
    //   .get("/accounting/creditor-invoice/")
    //   .then((res) => {
    //     console.log(res);
    //     setCreditorInvoices(res.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   });
  }

  function fetchGlAccounts() {
    axios
      .get("/accounting/ledger-accounts/")
      .then((res) => {
        console.log("ledger-accounts", res);
        setGlAccounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function fetchVatOptions() {
    axios
      .get("/accounting/vat-settings/")
      .then((res) => {
        console.log(res);
        setVatOptions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchCreditorInvoices();
    fetchGlAccounts();
    fetchVatOptions();
    fetchBaseCurrency();
  }, [url]);

  function handleFilters(e) {
    e.preventDefault();
    const year = e.target.year.value;
    const month = e.target.month.value;

    const updatedUrl = new URL(url);
    updatedUrl.searchParams.set("year", year);
    updatedUrl.searchParams.set("month", month);

    Inertia.replace(updatedUrl.href, { preserveState: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ rows });
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        date: new Date().toISOString().split("T")[0],
        creditor: "",
        details: "",
        inv_ref: "",
        gl_acc_number: "",
        currency: "",
        total_amount_inc: 0,
        vat: 0,
        net_amount_excl: 0,
        rate: 0,
      },
    ]);
  }

  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  function handleChange(e, index) {
    const { name, value } = e.target;
    setRows((prev) => {
      const updatedRows = [...prev];
      const currRow = updatedRows[index];
      let vatRate = Number((name === "vat" ? value : currRow.vat) || 0) || 0;
      let inc = Number((name === "total_amount_inc" ? value : currRow.total_amount_inc) || 0) || 0;
      let excl = (100 * inc) / (100 + vatRate);

      updatedRows[index] = { ...updatedRows[index], [name]: value };
      updatedRows[index].total_amount_inc = inc;
      updatedRows[index].vat = vatRate;
      updatedRows[index].net_amount_excl = excl.toFixed(2);
      return updatedRows;
    });
  }

  function handleCreditorSelect(selectedCreditor, index) {
    if (!selectedCreditor) return;

    setRows((prev) => {
      const updatedRows = [...prev];
      updatedRows[index] = { ...updatedRows[index], creditor: selectedCreditor.landlord_id };
      return updatedRows;
    });
  }

  return {
    rows,
    loading,
    glAccounts,
    vatOptions,
    showAddModal,
    baseCurrency,
    creditorInvoices,
    handleCreditorSelect,
    handleFilters,
    handleSubmit,
    handleChange,
    openAddModal: () => setShowAddModal(true),
    handleClose: () => setShowAddModal(false),
    removeRow,
    addRow,
  };
}
