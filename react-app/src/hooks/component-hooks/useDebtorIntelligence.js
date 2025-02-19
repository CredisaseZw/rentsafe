import { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import axios, { AxiosError } from 'axios';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useDebtorIntelligence(
  initialData,
  clientId,
  isCreditorView
) {
  const [isEditMode, setIsEditMode] = useState(!Boolean(initialData));
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { Auth } = usePage().props;

  const loggedInUser = `${Auth.user_profile.first_name} ${Auth.user_profile.last_name}`;
  function handleSave(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const submitData = Object.fromEntries(new FormData(e.target).entries());
    if (isCreditorView) {
      submitData.creditor_id = clientId.toString();
    } else {
      submitData.client_id = clientId.toString();
    }

    axios
      .put(reverseUrl('debtor_intelligence'), submitData)
      .then((res) => {
        const newData = {
          text: res.data.note,
          user: res.data.user_name,
          timestamp: res.data.updated_at || res.data.created_at,
        };
        setData(newData);
        setError('');
        setIsLoading(false);
        setIsEditMode(false);
      })
      .catch((error) => {
         setError(userFriendlyErrorOrResponse(error));
        setIsLoading(false);
        setIsEditMode(!Boolean(data));
      });
  }

  return {
    data,
    isEditMode,
    handleSave,
    loggedInUser,
    setIsEditMode,
    error,
    setError,
    isLoading,
  };
}
