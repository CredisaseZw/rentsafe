import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function useCompanySearch(url) {
  const [show, setShow] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const [reportData, setReportData] = useState();
  const [showReport, setShowReport] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerify, setShowVerify] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, setData, post } = useForm({
    searchParam: 'registration_name',
    searchValue: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseReport = () => setShowReport(false);
  const handleBulkButtonClick = () => setIsBulkAdd(true);

  function handleShowReport(e, id) {
    e.preventDefault();

    try {
      setIsReportLoading(true);
      toast.loading('Loading...', {
        duration: 2500,
        position: 'top-center',
      });

      if (id) {
        axios
          .post(reverseUrl('enquiry_count'), {
            isIndividual: false,
            isCompany: true,
            companyId: id,
          })
          .then((res) => {});
        axios
          .post(reverseUrl('company-report'), { companyId: id })
          .then((res) => {
            setSelectedRow(id);
            if (res.data?.is_eligible) {
              if (res.data?.require_otp) {
                setShowVerify(true);
                setReportData(res.data);
              } else {
                setShowReport(true);
                setReportData(res.data);
              }
            } else {
              toast.error(
                'You have exhausted your free enquiries. Please subscribe to get more enquiries.',
                {
                  duration: 4000,
                  id: 'error_',
                }
              );
            }
          })
          .catch((error) => {
            console.error('There was an error!', error);
          });
      }
    } finally {
      setIsReportLoading(false);
    }
  }

  function handleSingle() {
    setIsSingle(true);
    setIsMultiple(false);
  }

  function handleMultiple() {
    setIsMultiple(true);
    setIsSingle(false);
  }

  function changeHandler(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function submitHandler(e) {
    e.preventDefault();

    if (data.searchValue === '') {
      setErrors({ searchValue: 'Please enter a search value' });
      return;
    }

    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setFetchedData({});
        setErrors({});
        setNotFound(false);
      },
      onSuccess: (response) => {
        response.props.result.length === 0 && setNotFound(true);
        if (response.props.result.length > 0) {
          setFetchedData(response.props.result);
        }
        setIsLoading(false);
      },
      onError: () => {
        toast.error('Nothing to search...');
        setIsLoading(false);
      },
    });
  }

  return {
    data,
    show,
    notFound,
    errors,
    isSingle,
    isBulkAdd,
    reportData,
    showReport,
    showVerify,
    isMultiple,
    selectedRow,
    isLoading,
    fetchedData,
    isReportLoading,
    handleShow,
    handleClose,
    setNotFound,
    setIsBulkAdd,
    handleSingle,
    setShowReport,
    changeHandler,
    submitHandler,
    setShowVerify,
    handleMultiple,
    handleShowReport,
    handleCloseReport,
    handleBulkButtonClick,
  };
}
