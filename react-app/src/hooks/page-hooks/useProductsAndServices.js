import axios from 'axios';
import React, { use, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useProductsAndServices() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToEdit, setItemToEdit] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  function fetchItems() {
    axios
      .get('/accounting/products')
      .then((res) => {
        console.log(res);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchItems();
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
      .post('/accounting/products', data)
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
    console.log(Object.fromEntries(new FormData(e.target)));
    setItemToEdit(null);
  }

  return {
    items,
    loading,
    showAdd,
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
