import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react';

export default function useCompanyAdd(
  url,
  companyData,
  handleClose,
  setFetchedData
) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');

  const { data, setData, post, reset } = useForm({
    registeredName: companyData ? companyData.registration_name : '',
    tradingName: companyData ? companyData.trading_name : '',
    branch: companyData ? companyData.branch : '',
    companyRegistrationNumber: companyData
      ? companyData.registration_number
      : '',

    registrationDate: companyData ? companyData.registration_date : '',
    vatNumber: companyData ? companyData.vat_number : '',
    tinNumber: companyData ? companyData.tin_number : '',
    currentAddress: companyData ? companyData.address : '',
    landLine: companyData ? companyData.landline : '',
    mobileNumber: companyData ? companyData.mobile_phone : '',
    emailAddress: companyData ? companyData.email : '',
    website: companyData ? companyData.website : '',
    industry: companyData ? companyData.industry : '',
    note: companyData ? companyData.note : '',
    is_gvt: companyData ? companyData.is_government : false,
    company_id: companyData ? companyData.id : '',
    is_contracted: companyData ? companyData.is_contracted : false,
  });

  const changeHandler = (e) => {
    if (e.target.id === 'is_gvt') {
      setData({ ...data, [e.target.id]: e.target.checked });
    } else {
      setData({ ...data, [e.target.id]: e.target.value });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    data.registeredName =
      data.branch !== '' && !data.registeredName.split(' - ').at(-1)?.length
        ? data.registeredName + ' - ' + data.branch
        : data.registeredName;
    axios.post(reverseUrl('edit_company_user'), data).then((res) => {
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setFetchedData((prev) => {
          const oldData = prev.filter(
            (company) => company.id !== data.company_id
          );
          return [
            ...oldData,
            {
              id: data.company_id,
              registration_name: data.registeredName,
              trading_name: data.tradingName,
              registration_number: data.companyRegistrationNumber,
              registration_date: data.registrationDate,
              vat_number: data.vatNumber,
              tin_number: data.tinNumber,
              address: data.currentAddress,
              landline: data.landLine,
              mobile_phone: data.mobileNumber,
              email: data.emailAddress,
              website: data.website,
              industry: data.industry,
              note: data.note,
            },
          ];
        });
        handleClose();
      } else {
        toast.error(
          res.data?.message || 'Something went wrong! Please try again'
        );
        handleClose();
      }
    });
  };

  const handleSubmitIndividual = (e) => {
    e.preventDefault();
    data.registeredName =
      data.branch !== ''
        ? data.registeredName + ' - ' + data.branch
        : data.registeredName;
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setErrors('');
      },
      onSuccess: (response) => {
        reset();
        if (response.props.success) {
          toast.success(response.props.success);
          setIsLoading(false);
          handleClose();
        } else {
          toast.error(response.props.error);
        }
      },
      onError: (e) => {
        toast.error('Something went wrong! Please try again');
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  return {
    data,
    errors,
    isLoading,
    handleEdit,
    changeHandler,
    handleSubmitIndividual,
  };
}
