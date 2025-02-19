import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  friendlyDate,
  userFriendlyErrorOrResponse,
} from '../../utils/index.js';

export default function useCommunicationHistory(
  initialMessages,
  clientId,
  isCreditorView
) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainderType, setRemainderType] = useState('note');
  const [worksData, setWorksData] = useState(undefined);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const submitData = Object.fromEntries(new FormData(e.target).entries());
    if (isCreditorView) {
      submitData.creditor_id = String(clientId);
    } else {
      submitData.client_id = String(clientId);
    }
    submitData.reminder_type = remainderType.toUpperCase();
    if (remainderType === 'note') {
      submitData.action_date = new Date().toISOString().split('T')[0];
    }

    axios
      .post(reverseUrl('communication_history'), submitData)
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          {
            text: res.data.message,
            actionDone: res.data.action_done,
            user: res.data.user_name,
            communicationType: res.data.reminder_type.toLowerCase(),
            timestamp: res.data.created_at,
          },
        ]);
        setError('');
        setIsLoading(false);
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setIsLoading(false);
      });

    e.target.reset();
  }

  function openWorksOrMaintenance(data) {
    setWorksData({
      isWorks: data.communicationType === 'works',
      ...data,
    });
    setRemainderType('works');
  }

  function closeWorks() {
    setRemainderType('note');
    setWorksData(undefined);
  }

  const messagesToMap = messages
    .toSorted()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return {
    error,
    messages,
    worksData,
    isLoading,
    messagesToMap,
    remainderType,
    setError,
    closeWorks,
    handleSubmit,
    setRemainderType,
    openWorksOrMaintenance,
  };
}
