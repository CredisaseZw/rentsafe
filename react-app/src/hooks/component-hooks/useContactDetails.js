import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useContactDetails(
  initialData,
  clientId,
  isCreditorView,
  leaseId
) {
  const [isEditMode, setIsEditMode] = useState(!Boolean(initialData));
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const submitData = Object.fromEntries(new FormData(e.target).entries());
    if (isCreditorView) {
      submitData.creditor_id = clientId.toString();
    } else {
      submitData.client_id = clientId.toString();
      submitData.lease_id = leaseId;
    }
    submitData.other_numbers = submitData.other_numbers
      .split(',')
      .filter(Boolean)
      .map((item) => item.trim());

    console.log(submitData);

    axios
      .put(reverseUrl('update_client_contact_details'), submitData)
      .then((res) => {
        const newData = {
          contactPerson: `${res.data['firstname']} ${res.data['surname']}`,
          smsNumber: res.data['sms_number'],
          otherNumbers: res.data['other_numbers']
            ? res.data['other_numbers'].join(', ')
            : '',
          emailAddress: res.data['email_address'],
          address: res.data['address'],
        };
        console.log({ res, newData });
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
    setIsEditMode,
    error,
    setError,
    isLoading,
  };
}
