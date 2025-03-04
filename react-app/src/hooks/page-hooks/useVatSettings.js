import { useState } from 'react';

export default function useVatSettings(initialTaxOptions) {
  const [taxOptions, setTaxOptions] = useState(initialTaxOptions);

  function addTaxOption() {
    console.log('adding');
    setTaxOptions((prev) => [...prev, { description: '', rate: '' }]);
  }

  function removeTaxOption(index) {
    setTaxOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
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
  }

  return {
    taxOptions,
    addTaxOption,
    handleSubmit,
    removeTaxOption,
  };
}
