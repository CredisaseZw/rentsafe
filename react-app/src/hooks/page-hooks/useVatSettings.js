import { useForm } from '@inertiajs/inertia-react';

export default function useVatSettings(initialTaxOptions) {
  const { data: taxOptions, setData: setTaxOptions } =
    useForm(initialTaxOptions);

  function addTaxOption() {
    console.log('adding');
    setTaxOptions((prev) => [...prev, { description: '', rate: '' }]);
  }

  function removeTaxOption(index) {
    setTaxOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(taxOptions);
  }

  return {
    taxOptions,
    addTaxOption,
    handleSubmit,
    removeTaxOption,
  };
}
