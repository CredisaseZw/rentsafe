import { usePage } from '@inertiajs/inertia-react';
import { useState } from 'react';
import axios from 'axios';

export default function useAdverseDataVersion2() {
  const auth = usePage().props.Auth;
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [tenantType, setTenantType] = useState('');
  const [form, setForm] = useState({
    processing: false,
    wasSuccessful: false,
    hasErrors: false,
    errors: {},
  });

  const data_source = `${auth.user_profile.first_name} ${auth.user_profile.last_name} - ${auth.user_profile.individual_id}`;
  const creditor = `${auth.company.company_id ? auth.company.company_name + ' - ' + auth.company.company_id : data_source}`;
  const creditor_id = auth.company.company_id || user_profile.individual_id;

  const openModal = () => setShow(true);
  const showSingleTab = () => setActiveTab('single');
  const showMultipleTab = () => setActiveTab('multiple');

  function closeModal() {
    setForm(() => ({
      processing: false,
      wasSuccessful: false,
      hasErrors: false,
      errors: {},
    }));
    setTenantType('');
    setShow(false);
  }

  function axios_post(url, data) {
    setForm(() => ({
      processing: true,
      wasSuccessful: false,
      hasErrors: false,
      errors: {},
    }));

    axios
      .post(url, data)
      .then((response) => {
        console.log(response);

        setForm(() => ({
          processing: false,
          wasSuccessful: true,
          hasErrors: false,
          errors: {},
        }));
      })
      .catch((error) => {
        console.log(error);

        setForm(() => ({
          processing: false,
          wasSuccessful: false,
          hasErrors: true,
          errors: { error: JSON.stringify(error.response.data) },
        }));
      });
  }

  function handleSingleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data['creditor_id'] = creditor_id;
    data['data_source'] = data_source;
    console.log(data);

    axios_post(reverseUrl('create_claim'), data);
  }

  function handleMultipleSubmit(e) {
    e.preventDefault();
    console.log('multple submission');
  }

  return {
    show,
    openModal,
    closeModal,
    activeTab,
    showSingleTab,
    showMultipleTab,
    handleSingleSubmit,
    handleMultipleSubmit,
    creditor,
    data_source,
    form,
    tenantType,
    setTenantType,
  };
}
