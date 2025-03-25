import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useProductsAndServices() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToEdit, setItemToEdit] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [taxOptions, setTaxOptions] = React.useState([]);
  const [salesAccounts, setSalesAccounts] = React.useState([]);

  function fetchTaxOptions() {
    axios
      .get("/accounting/vat-settings/")
      .then((res) => {
        setTaxOptions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function fetchSalesAccounts() {
    axios
      .get("/accounting/sales-accounts/")
      .then((res) => {
        console.log({ salesAccounts: res });
        setSalesAccounts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchItems() {
    axios
      .get("/accounting/items/")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchCategories() {
    axios
      .get("/accounting/sales-categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchItems();
    fetchSalesAccounts();
    fetchCategories();
    fetchTaxOptions();
  }, []);

  function handleClose() {
    setItemToEdit(null);
    setShowAdd(false);
  }

  function openShowAdd() {
    setShowAdd(true);
  }

  function handleItemAddition(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));
    axios
      .post("/accounting/items/", data)
      .then((res) => {
        setLoading(false);
        console.log(res);
        toast.success("Item added successfully");
        fetchItems();
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function handleEdit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    axios
      .patch(`/accounting/items/${itemToEdit.id}/`, data)
      .then((res) => {
        toast.success("Item updated successfully");
        handleClose();
        fetchItems();
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function handleDelete() {
    axios
      .delete(`/accounting/items/${itemToDelete.id}/`)
      .then(() => {
        toast.success("Item deleted successfully");
        fetchItems();
        setItemToDelete(null);
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  return {
    items,
    loading,
    showAdd,
    categories,
    taxOptions,
    itemToEdit,
    itemToDelete,
    salesAccounts,
    setItemToDelete,
    setItemToEdit,
    handleItemAddition,
    openShowAdd,
    handleClose,
    handleDelete,
    handleEdit,
  };
}
