import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function usePaymentPlans(
  initialPaymentPlans,
  clientId,
  refreshClientViewData,
  isCreditorView,
  creditorName,
  leaseId
) {
  const [paymentPlans, setPaymentPlans] = useState(initialPaymentPlans);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPaymentPlans, setNewPaymentPlans] = useState([]);

  function confirmNewPaymentPlans() {
    setIsLoading(true);
    setError('');

    const submitData = {
      plans: newPaymentPlans.map((plan) => ({
        ...plan,
        ...(isCreditorView
          ? { creditor_id: clientId.toString() }
          : { client_id: clientId.toString() }),
        spoke_with: isCreditorView ? creditorName : plan.spoke_with,
        lease_id: leaseId,
      })),
    };

    axios
      .post(reverseUrl('payment_plans'), submitData)
      .then((res) => {
        setNewPaymentPlans([]);
        // setPaymentPlans((prev) => [
        //   ...prev,
        //   ...res.data['plans'].map((item) => ({
        //     id: item.id,
        //     date: item.expected_pay_date,
        //     person: item.spoke_with,
        //     amount: item.amount,
        //   })),
        // ]);
        setError('');
        setIsLoading(false);
        refreshClientViewData();
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setNewPaymentPlans([]);
        setIsLoading(false);
      });
  }

  function addNewPaymentPlan(plan) {
    setNewPaymentPlans((prev) => [...prev, plan]);
  }

  function clearNewPaymentPlans() {
    setNewPaymentPlans([]);
  }

  return {
    paymentPlans,
    newPaymentPlans,
    addNewPaymentPlan,
    confirmNewPaymentPlans,
    clearNewPaymentPlans,
    error,
    setError,
    isLoading,
  };
}
