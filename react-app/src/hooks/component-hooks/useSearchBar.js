import { useForm, usePage } from '@inertiajs/inertia-react';
import { useRef } from 'react';

export default function useSearchBar(searchBy) {
  const { url: urlProp } = usePage();
  const { get } = useForm();
  const formRef = useRef(null);
  const defaultValue = new URL(urlProp).searchParams.get(searchBy);

  function handleSearch(e) {
    e.preventDefault();
    const url = new URL(urlProp);
    const value = e.target[searchBy].value;

    if (value.trim()) {
      url.searchParams.set(searchBy, value);
    } else {
      url.searchParams.delete(searchBy);
    }

    url.searchParams.delete('page');
    get(url.href, { preserveState: true });
  }

  function clear() {
    const url = new URL(urlProp);
    url.searchParams.delete(searchBy);
    url.searchParams.delete('page');
    get(url.href, { preserveState: false });
  }

  return {
    defaultValue,
    handleSearch,
    clear,
    formRef,
  };
}
