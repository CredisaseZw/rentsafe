import { useForm } from '@inertiajs/inertia-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import {
  userFriendlyErrorOrResponse,
  areMonthlyBalancesAllDefinedInOrder,
} from '../../utils';

export default function useCompanyLeaseForm(
  handleClose,
  action,
  lesseeDetails,
  subscriptionPeriod
) {
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('single');
  const [errors, setErrors] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const { data, setData, post, reset } = useForm({
    identificationNumber: lesseeDetails?.reg_ID_Number || '',
    lesseeName: lesseeDetails?.name || '',
    lesseeAddress: lesseeDetails?.address || '',
    mobile: lesseeDetails?.mobile || '',
    email: lesseeDetails?.email || '',
    rentGuarantorId: lesseeDetails?.rent_guarantor_id || '',
    rentGuarantorIdType: lesseeDetails?.rent_guarantor_id_type || '',
    rentGuarantorName: lesseeDetails?.rent_guarantor_name || '',
    leaseDetails: lesseeDetails?.lease_details || '',
    leaseStartDate: lesseeDetails?.start_date || '',
    rentVariable: lesseeDetails?.rent_variable || false,
    leaseEndDate: lesseeDetails?.end_date || '',
    leaseCurrency: lesseeDetails?.currency || 'USD',
    depositAmount: lesseeDetails?.deposit_amount || 0,
    leasePeriod: subscriptionPeriod || lesseeDetails?.lease_period,
    depositPeriod: lesseeDetails?.deposit_period || 0,
    monthlyRental: lesseeDetails?.monthly_rentals || 0,
    paymentPeriodStart: lesseeDetails?.payment_period_start || '25',
    paymentPeriodEnd: lesseeDetails?.payment_period_end || '7',
    isCompany: true,
    leaseId: lesseeDetails?.lease_id || -1,
    monthOneBalance: '',
    monthTwoBalance: '',
    monthThreeBalance: '',
    moreThanThreeMonthsBalance: '',
    currentBalance: '',
    isGovernment: false,
    accountNumber: lesseeDetails.customer_number || '',

    landlordType: lesseeDetails?.agent_reg_number ? 'COMPANY' : 'INDIVIDUAL',
    regIdNumber: lesseeDetails?.agent_reg_number || lesseeDetails?.agent_id,
    landlordName: lesseeDetails?.agent_name || '',
    commission: Number(
      lesseeDetails?.commission_amount &&
        lesseeDetails?.commission_amount !== 'N/A'
        ? lesseeDetails?.commission_amount
        : 0
    ),
    openingBalance: Number(
      lesseeDetails?.agent_opening_balance &&
        lesseeDetails?.agent_opening_balance !== 'N/A'
        ? lesseeDetails?.agent_opening_balance
        : 0
    ),
  });
  const [value, setValue] = useState(action === 'edit' ? data.lesseeName : '');
  const [clientName, setClientName] = useState(data.lesseeName);
  const [regNumber, setRegNumber] = useState(data.email);
  const [clientId, setClientId] = useState(data.identificationNumber);
  const [mobileNo, setMobileNo] = useState(data.mobile);
  const [address, setAddress] = useState(data.lesseeAddress);

  const paymentPeriodStart = moment();

  const currentDate = paymentPeriodStart
    .clone()
    .add(data.paymentPeriodEnd >= paymentPeriodStart.date() ? 0 : 1, 'months')
    .date(data.paymentPeriodEnd)
    .format('DD-MMM-YY');
  const monthOne = paymentPeriodStart
    .clone()
    .subtract(
      data.paymentPeriodEnd >= paymentPeriodStart.date() ? 1 : 0,
      'months'
    )
    .date(data.paymentPeriodEnd)
    .format('DD-MMM-YY');
  const monthTwo = paymentPeriodStart
    .clone()
    .subtract(
      data.paymentPeriodEnd >= paymentPeriodStart.date() ? 2 : 1,
      'months'
    )
    .date(data.paymentPeriodEnd)
    .format('DD-MMM-YY');
  const monthThree = paymentPeriodStart
    .clone()
    .subtract(
      data.paymentPeriodEnd >= paymentPeriodStart.date() ? 3 : 2,
      'months'
    )
    .date(data.paymentPeriodEnd)
    .format('DD-MMM-YY');

  useEffect(() => {
    setData({
      ...data,
      lesseeName: clientName,
      email: regNumber,
      identificationNumber: String(clientId),
      mobile: mobileNo,
      lesseeAddress: address,
    });
  }, [clientId, clientName, regNumber, mobileNo, address]);

  useEffect(() => {
    const getUser = () => {
      if (
        data.rentGuarantorId &&
        /^[\d]{8,9}[A-Za-z]{1}[\d]{2}$/.test(data.rentGuarantorId)
      ) {
        try {
          setIsLoading(true);
          axios
            .post(reverseUrl('get-user'), {
              identificationNumber: data.rentGuarantorId,
            })
            .then((response) => {
              if (response.data?.props.name) {
                setData({
                  ...data,
                  rentGuarantorName: response.data?.props.name || '',
                  rentGuarantorIdType:
                    response.data?.props.identification_type || '',
                });
              } else {
                toast.error('User not found!', {
                  duration: 5000,
                  icon: '❌',
                });
                setErrors(response.data?.props?.errors);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              toast.error('Something went wrong! Please try again', {
                duration: 5000,
              });
              setErrors(error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (error) {
          toast.error('Something went wrong! Please try again', {
            duration: 5000,
          });
          setErrors(error);
        }
      }
    };
    if (action === 'add') {
      getUser();
    }
  }, [data.rentGuarantorId]);

  const changeHandler = (e) => {
    if (e.target.id === 'rentVariable') {
      setData({ ...data, [e.target.id]: e.target.checked });
    } else if (e.target.id === 'leasePeriod') {
      if (Number(e.target.value) > Number(subscriptionPeriod)) {
        toast.error(
          `Lease period cannot be more than your subscription period (${subscriptionPeriod} months)`,
          { duration: 5000 }
        );
        setData({ ...data, [e.target.id]: subscriptionPeriod });
      } else {
        setData({ ...data, [e.target.id]: e.target.value });
      }
    } else {
      setData({ ...data, [e.target.id]: e.target.value });
    }
  };

  const handleAddLease = async (e) => {
    e.preventDefault();
    if (!data.lesseeName) {
      toast.error('Please add a valid lessee', { duration: 5000 });
      return;
    }
    setIsLoading(true);
    data.leaseEndDate = moment(data.leaseEndDate).format('YYYY-MM-DD');
    data.monthOneBalance = Number(data.monthOneBalance);
    data.monthTwoBalance = Number(data.monthTwoBalance);
    data.monthThreeBalance = Number(data.monthThreeBalance);
    data.moreThanThreeMonthsBalance = Number(data.moreThanThreeMonthsBalance);
    data.currentBalance = Number(data.currentBalance);
    data.monthOneDate = moment(monthOne).format('YYYY-MM-DD');
    data.monthTwoDate = moment(monthTwo).format('YYYY-MM-DD');
    data.monthThreeDate = moment(monthThree).format('YYYY-MM-DD');
    data.currentDate = moment(currentDate).format('YYYY-MM-DD');
    data.monthlyRental = Number(data.monthlyRental);
    data.depositAmount = data.depositAmount;
    data.depositPeriod = Number(data.depositPeriod);
    data.leasePeriod = Number(data.leasePeriod);
    data.outStandingBalance =
      data.moreThanThreeMonthsBalance +
      data.monthThreeBalance +
      data.monthTwoBalance +
      data.monthOneBalance +
      data.currentBalance;

    if (Number.isNaN(Number(data.outStandingBalance))) {
      toast.error('balances must be numbers', { duration: 5000 });
      setIsLoading(false);
      return;
    }

    if (
      !areMonthlyBalancesAllDefinedInOrder([
        data.monthOneBalance,
        data.monthTwoBalance,
        data.monthThreeBalance,
        data.moreThanThreeMonthsBalance,
      ])
    ) {
      toast.error(
        'you cannot submit tenant opening balances where there are balances in the older months without balances in the most recent months. Rent is paid oldest first',
        { duration: 5000 }
      );
      setIsLoading(false);
      return;
    }

    post(reverseUrl('create-company-lease'), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        const messages = response?.props?.flash.message;
        if (messages && response?.props?.flash.type === 'success') {
          handleClose();
          reset();
          toast.success(userFriendlyErrorOrResponse(messages), {
            duration: 15000,
          });
        } else if (messages && response?.props?.flash.type === 'error') {
          toast.error(messages.message, { duration: 5000 });
        }
        setIsLoading(false);
      },
      onError: (error) => {
        toast.error(userFriendlyErrorOrResponse(error), { duration: 5000 });
        setErrors(error);
        setIsLoading(false);
      },
    });
  };

  const handleUpdateLease = (e) => {
    e.preventDefault();
    data.leaseStartDate = moment(data.leaseStartDate).format('YYYY-MM-DD');
    data.leaseEndDate = moment(data.leaseEndDate).format('YYYY-MM-DD');

    post(reverseUrl('client-edit-lease'), {
      onStart: () => {
        console.log(data);
        setIsLoading(true);
      },
      onSuccess: (response) => {
        if (response?.props?.flash.type === 'success') {
          handleClose();
          toast.success('Lease updated successfully', { duration: 5000 });
        } else if (response?.props?.flash.type === 'error') {
          toast.error('An error occurred, please try again', {
            duration: 5000,
          });
        }
        setIsLoading(false);
        // alert(
      },
      onError: (e) => {
        toast.error(userFriendlyErrorOrResponse(e), { duration: 5000 });
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  function handleSubmit(e) {
    e.preventDefault;
    if (action === 'add') handleAddLease(e);
    else if (action === 'edit') handleUpdateLease(e);
    else throw new Error('Invalid action: ' + action);
  }

  function changeRentGuarantorId(values) {
    setData((prev) => ({
      ...prev,
      rentGuarantorId: values.label.split(' - ')[1],
    }));
  }

  return {
    isSingleTab: tab === 'single',
    isLoading,
    errors,
    showReceipt,
    data,
    value,
    currentDate,
    monthOne,
    monthTwo,
    monthThree,
    handleSubmit,
    toggleTab: () => {
      setTab((prev) => (prev === 'single' ? 'multiple' : 'single'));
    },
    viewReceipt: () => setShowReceipt(true),
    closeReceipt: () => setShowReceipt(false),
    setValue,
    setClientName,
    setClientId,
    setMobileNo,
    setRegNumber,
    setAddress,
    changeHandler,
    changeLandlordType: (type) =>
      setData((prev) => ({
        ...prev,
        landlordType: type,
        regIdNumber: '',
        landlordName: '',
      })),
    changeLandlord: (values) =>
      setData((prev) => ({
        ...prev,
        landlordName: values.label.split(' - ')[0],
        regIdNumber: values.label.split(' - ')[1],
        landlordName: values.label.split(' - ')[0],
      })),
    changeRentGuarantorId,
    toggleIsGovernment: () =>
      setData((prev) => ({
        ...prev,
        isGovernment: !prev.isGovernment,
      })),
  };
}
