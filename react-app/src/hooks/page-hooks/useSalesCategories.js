import React from 'react';

export default function useSalesCategories() {
  const [showAdd, setShowAdd] = React.useState(false);

  function handleClose() {
    setShowAdd(false);
  }

  function openShowAdd() {
    setShowAdd(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(Object.fromEntries(new FormData(e.target)));
    handleClose();
  }

  function deleteCategory(category) {
    console.log(category);
  }

  return {
    showAdd,
    handleSubmit,
    deleteCategory,
    openShowAdd,
    handleClose,
  };
}
