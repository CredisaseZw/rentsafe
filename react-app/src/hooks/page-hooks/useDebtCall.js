import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { userFriendlyErrorOrResponse } from '../../utils';
export default function useDebtCall() {
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(reverseUrl('client-leases'), { params: { is_debt_call: true } })
      .then((res) => {
        setData(
          res.data[0]?.leases?.map((lease) => ({
            lease_id: lease.lease_id,
            account_number: lease.customer_number || '',
            customer_name: lease.name || '',
            currency: lease.currency || '',
            is_company: lease.is_company || '',
            balance_owing: lease.owing_amount || '',
          })) || []
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);

    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd);
    payload['contact_methods'] = fd.getAll('contact_methods');
    payload['aging_filters'] = fd.getAll('aging_filters');
    payload['leases_to_sms'] = fd.getAll('leases_to_sms');
    payload['leases_to_email'] = fd.getAll('leases_to_email');
    console.log({ payload });

    const valid = validate(payload);
    if (!valid) {
      setProcessing(false);
      return;
    }
    axios
      .post(reverseUrl('debt_call'), payload)
      .then((res) => {
        toast.success(userFriendlyErrorOrResponse(res));
      })
      .catch((err) => {
        console.log(err);
        toast.error(userFriendlyErrorOrResponse(err));
      });
    setProcessing(false);
  }

  return {
    data,
    processing,
    handleSubmit,
  };
}

function validate(payload) {
  if (!(payload['leases_to_email'].length || payload['leases_to_sms'].length)) {
    toast.error('please select email/sms for at least one customer');
    return false;
  }

  const if_email_checked_but_no_email_message =
    !!payload['leases_to_email'].length && !payload['email_message'];
  if (if_email_checked_but_no_email_message) {
    toast.error(
      'please enter an email message or untick all customer email boxes'
    );
    return false;
  }

  const if_sms_checked_but_no_sms_message =
    !!payload['leases_to_sms'].length && !payload['sms_message'];
  if (if_sms_checked_but_no_sms_message) {
    toast.error('please enter an sms message or untick all customer sms boxes');
    return false;
  }

  return true;
}
