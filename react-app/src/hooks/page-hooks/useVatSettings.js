import axios from 'axios';
import { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useVatSettings() {
  const [taxOptions, setTaxOptions] = useState();
  const [loading, setLoading] = useState(false);

  function fetchTaxOptions() {
    axios
      .get('/accounting/vat-settings/')
      .then((res) => {
        console.log(res);
        setTaxOptions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchTaxOptions();
  }, []);

  function addTaxOption() {
    console.log('adding');
    setTaxOptions((prev) => [...prev, { description: '', rate: '' }]);
  }

  function removeTaxOption(index) {
    setTaxOptions((prev) => prev.filter((_, i) => i !== index));
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
    console.log(data);

    axios
      .post('/accounting/vat-settings/', data)
      .then((res) => {
        setLoading(false);
        console.log(res);
        toast.success(userFriendlyErrorOrResponse(res));
        fetchTaxOptions();
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
    addTaxOption,
    handleSubmit,
    removeTaxOption,
  };
}
