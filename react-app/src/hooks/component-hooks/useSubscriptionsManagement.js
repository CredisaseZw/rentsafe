import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSubscriptionsManagement(
  makeActive,
  id,
  beforeOpenningModal
) {
  const [show, setShow] = useState(false);
  const [subLength, setSubLength] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showCompanyLeaseForm, setShowCompanyLeaseForm] = useState(false);
  const [showIndividualLeaseForm, setShowIndividualLeaseForm] = useState(false);

  useEffect(() => {
    axios
      .post(reverseUrl('open_subscription'))
      .then((res) => setSubscriptions(res.data))
      .catch((err) => console.log(err));
  }, [show]);

  function showLeaseFormFor(leaseType) {
    if (leaseType === 'company') setShowCompanyLeaseForm(true);
    else setShowIndividualLeaseForm(true);
  }

  function closeModal() {
    makeActive('use-last-last');
    setShow(false);
  }

  function activateSub(sub, leaseType) {
    showLeaseFormFor(leaseType);
    setSubLength(sub.period_left);
    closeModal();
  }

  function openModal() {
    beforeOpenningModal();
    makeActive(id);
    setShow(true);
  }

  return {
    show,
    subLength,
    subscriptions,
    showCompanyLeaseForm,
    showIndividualLeaseForm,
    openModal,
    closeModal,
    activateSub,
    closeCompanyLeaseForm: () => setShowCompanyLeaseForm(false),
    closeIndividualLeaseForm: () => setShowIndividualLeaseForm(false),
  };
}
