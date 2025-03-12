import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useVatSettings() {
  const [newTaxOptions, setNewTaxOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  function fetchTaxOptions() {
    axios
      .get('/accounting/vat-settings/')
      .then((res) => {
        setTaxOptions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchTaxOptions();
  }, []);

  function addNewTaxOption() {
    setNewTaxOptions((prev) => [
      ...prev,
      {
        id: 'item-' + Math.random().toString(36).substr(2, 9),
        description: '',
        rate: '',
      },
    ]);
  }

  function removeNewTaxOption(id) {
    setNewTaxOptions((prev) => prev.filter((option) => option.id !== id));
  }

  function changeHandler(name, value, id) {
    if (id) {
      setNewTaxOptions((prev) =>
        prev.map((option) =>
          option.id === id ? { ...option, [name]: value } : option
        )
      );
    }
  }

  function removeTaxOption(option) {
    axios
      .delete(`/accounting/vat-settings/${option.id}/`)
      .then((res) => {
        toast.success('VAT setting deleted successfully');
        fetchTaxOptions();
      })
      .catch((err) => {
        console.error(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const data = Array.from(form.entries()).reduce((acc, [key, value]) => {
      const [prefix, index] = key.split('-');
      if (!acc[index]) {
        acc[index] = {};
      }
      acc[index][prefix] = value;
      return acc;
    }, []);

    axios
      .post('/accounting/vat-settings/', data)
      .then((res) => {
        setLoading(false);
        toast.success('VAT settings updated successfully');
        fetchTaxOptions();
        setNewTaxOptions([]);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }

  return {
    loading,
    taxOptions,
    newTaxOptions,
    handleSubmit,
    changeHandler,
    addNewTaxOption,
    removeTaxOption,
    removeNewTaxOption,
  };
}
