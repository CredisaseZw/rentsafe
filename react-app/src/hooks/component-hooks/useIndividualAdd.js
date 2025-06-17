import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "@inertiajs/inertia-react";
import { userFriendlyErrorOrResponse, validateZimbabweanID } from "../../utils";

export default function useIndividualAdd(handleClose, url, action, userDetails, setFetchedData) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState("");
  const { data, setData, post, reset } = useForm({
    firstName: userDetails?.firstname || "",
    lastName: userDetails?.surname || "",
    identificationNumber: userDetails?.identification_number || "",
    identificationType: userDetails?.identification_type || "",
    gender: userDetails?.gender || "",
    dob: userDetails?.dob || "",
    maritalStatus: userDetails?.marital_status || "",
    address: userDetails?.address || "",
    mobileNumber: userDetails?.mobile || "",
    landLine: userDetails?.landline || "",
    emailAddress: userDetails?.email || "",
    currentEmployer: userDetails?.employer_name || "",
    jobTitle: userDetails?.job_title || "",
    dateOfemployment: userDetails?.date_of_employment || "",
    individualId: userDetails?.id || -1,
  });

  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  function handleSubmitIndividual(e) {
    e.preventDefault();
    if (
      data.identificationType === "nationalid" &&
      !validateZimbabweanID(data.identificationNumber)
    ) {
      setIsLoading(false);
      toast.error("Invalid national id number");
      return;
    }
    if (data.identificationType === "servicesid") {
      toast.error("Service ID not supported yet. Please use passport or national ID");
      return;
    }
    if (
      data.mobileNumber.length < 10 ||
      data.mobileNumber.length > 13 ||
      /\D/.test(data.mobileNumber)
    ) {
      toast.error("Mobile number must be between 10 and 13 digits");
      return;
    }
    if (
      data.emailAddress !== "" &&
      !/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.emailAddress)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        reset();
        // toast.success('OTP has been sent to user');
        toast.success("individual created!");
        setIsLoading(false);
        handleClose();
      },
      onError: (e) => {
        toast.error("Something went wrong! Please try again");
        setErrors(e);
        setIsLoading(false);
      },
    });
  }

  function handleUpdateIndividual(e) {
    e.preventDefault();
    let uri = reverseUrl("edit_individual_user");
    if (action === "edit-agent") uri = reverseUrl("edit-agent");
    axios.post(uri, data).then((response) => {
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setFetchedData((prev) => {
          const oldData = prev.filter((item) => item.id !== data.individualId);
          return [
            ...oldData,
            {
              id: data.individualId,
              firstname: data.firstName,
              surname: data.lastName,
              identification_number: data.identificationNumber,
              identification_type: data.identificationType,
              gender: data.gender,
              dob: data.dob,
              marital_status: data.maritalStatus,
              address: data.address,
              mobile: data.mobileNumber,
              land_line: data.landLine,
              email_address: data.emailAddress,
              employer_name: data.currentEmployer,
              job_title: data.jobTitle,
              date_of_employment: data.dateOfemployment,
            },
          ];
        });
        handleClose();
      } else if (response.data.errors) {
        toast.error(userFriendlyErrorOrResponse(response));
        return;
      } else {
        toast.error("Something went wrong! Please try again");
        handleClose();
      }
    });
  }

  return {
    data,
    errors,
    isLoading,
    changeHandler,
    handleSubmitIndividual,
    handleUpdateIndividual,
  };
}
