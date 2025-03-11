import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useProductsAndServices() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToEdit, setItemToEdit] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  function fetchItems() {
    axios
      .get('/accounting/products/')
      .then((res) => {
        console.log(res);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchCategories() {
    axios
      .get('/accounting/sales-categories/')
      .then((res) => {
        console.log(res);
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  function handleClose() {
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
      .post('/accounting/products/', data)
      .then((res) => {
        setLoading(false);
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
        fetchItems();
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function handleDelete() {
    console.log('Deleting item:', itemToDelete);
    setItemToDelete(null);
  }

  function handleEdit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    axios
      .patch(`/accounting/products/${itemToEdit.id}/`, data)
      .then((res) => {
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
        fetchItems();
        handleClose();
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
    itemToEdit,
    itemToDelete,
    setItemToDelete,
    setItemToEdit,
    handleItemAddition,
    openShowAdd,
    handleClose,
    handleDelete,
    handleEdit,
  };
}
