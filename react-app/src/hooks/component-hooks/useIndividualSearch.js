import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "@inertiajs/inertia-react";
import { useState } from "react";

export default function useIndividualSearch(url) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const { data, setData, post } = useForm({
    searchParam: "fullname",
    searchValue: "",
  });

  function handleShowReport(e, id) {
    e.preventDefault();
    toast.loading("Loading...", {
      duration: 2500,
      position: "top-center",
    });
    try {
      setIsReportLoading(true);
      if (id) {
        axios
          .post(reverseUrl("enquiry_count"), {
            isIndividual: true,
            isCompany: false,
            individualId: id,
          })
          .then((res) => {});
        axios
          .post(reverseUrl("individual-report"), { individualId: id })
          .then((res) => {
            setSelectedRow(id);
            if (res.data?.is_eligible) {
              if (res.data?.require_otp) {
                setReportData(res.data);
              } else {
                setReportData(res.data);
                setIsVerified(true);
              }
            } else {
              toast.error(
                "You have exhausted your free enquiries. Please subscribe to get more enquiries.",
                {
                  duration: 4000,
                  id: "error_",
                }
              );
            }
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
    } finally {
      setIsReportLoading(false);
    }
  }

  function changeHandler(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function submitHandler(e) {
    e.preventDefault();

    if (data.searchValue === "") {
      setErrors({ searchValue: "The search value field is required." });
      return;
    }

    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setFetchedData([]);
        setErrors({});
        setNotFound(false);
      },
      onSuccess: (response) => {
        //This will return true if the object is empty, otherwise false
        const isObjectEmpty = (objectName) => {
          return JSON.stringify(objectName) === "{}";
        };
        response.props.result.length === 0 && setNotFound(true);
        if (isObjectEmpty(response.props.result) === true) {
        } else {
          setFetchedData(response.props.result);
          // setNotFound(false)
        }

        setIsLoading(false);
      },
      onError: (e) => {
        setIsLoading(false);
      },
    });
  }

  function handleSingle() {
    setIsSingle(true);
    setIsMultiple(false);
  }

  function handleMultiple() {
    setIsMultiple(true);
    setIsSingle(false);
  }

  function handleBulkButtonClick() {
    setIsBulkAdd(true);
  }

  return {
    show,
    data,
    errors,
    notFound,
    isSingle,
    isLoading,
    isBulkAdd,
    isMultiple,
    reportData,
    isVerified,
    selectedRow,
    fetchedData,
    isReportLoading,
    handleShow,
    setNotFound,
    handleClose,
    handleSingle,
    setIsBulkAdd,
    setIsVerified,
    changeHandler,
    submitHandler,
    handleMultiple,
    handleShowReport,
    handleBulkButtonClick,
  };
}
