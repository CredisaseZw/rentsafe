import React from 'react';

export default function useProductsAndServices() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToEdit, setItemToEdit] = React.useState(null);

  function handleClose() {
    setShowAdd(false);
  }

  function openShowAdd() {
    setShowAdd(true);
  }

  function handleItemAddition(e) {
    e.preventDefault();
    console.log(Object.fromEntries(new FormData(e.target)));
    handleClose();
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
