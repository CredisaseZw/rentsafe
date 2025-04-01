import axios from "axios";
import React, { use, useEffect } from "react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useSalesCategories() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  function handleClose() {
    setShowAdd(false);
  }

  function openShowAdd() {
    setShowAdd(true);
  }

  function getCategories() {
    axios
      .get("/accounting/sales-categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  function handleAddCategory(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    axios
      .post("/accounting/sales-categories/", data)
      .then((res) => {
        setLoading(false);
        console.log(res);
        toast.success("Category added successfully");
        handleClose();
        getCategories();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function deleteCategory() {
    axios
      .delete(`/accounting/sales-categories/${categoryToDelete.id}/`)
      .then((res) => {
        console.log(res);
        toast.success("Category deleted successfully");
        setCategoryToDelete(null);
        getCategories();
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  return {
    showAdd,
    loading,
    categories,
    categoryToDelete,
    setCategoryToDelete,
    deleteCategory,
    handleAddCategory,
    openShowAdd,
    handleClose,
  };
}
