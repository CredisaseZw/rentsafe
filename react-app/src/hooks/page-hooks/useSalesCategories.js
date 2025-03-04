import React from 'react';

export default function useSalesCategories() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);

  function handleClose() {
    setShowAdd(false);
  }

  function openShowAdd() {
    setShowAdd(true);
  }

  function handleAddCategory(e) {
    e.preventDefault();
    console.log(Object.fromEntries(new FormData(e.target)));
    handleClose();
  }

  function deleteCategory() {
    console.log(categoryToDelete);
    setCategoryToDelete(null);
  }

  return {
    showAdd,
    categoryToDelete,
    setCategoryToDelete,
    deleteCategory,
    handleAddCategory,
    openShowAdd,
    handleClose,
  };
}
