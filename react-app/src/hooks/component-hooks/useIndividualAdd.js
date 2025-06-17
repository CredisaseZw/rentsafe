import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "@inertiajs/inertia-react";
import { userFriendlyErrorOrResponse, validateZimbabweanID } from "../../utils";
import { truncate } from "lodash";

export default function useIndividualAdd(handleClose, url, action, userDetails, setFetchedData) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { data, setData, post, reset, errors } = useForm({
    firstName: userDetails?.firstname || "",
    lastName: userDetails?.surname || "",
    identificationNumber: userDetails?.identification_number || "",
    identificationType: userDetails?.identification_type || "",
    gender: userDetails?.gender || "",
    dob: userDetails?.dob || "",
    maritalStatus: userDetails?.marital_status || "",
    mobileNumber: userDetails?.mobile || "",
    landLine: userDetails?.landline || "",
    emailAddress: userDetails?.email || "",
    currentEmployer: userDetails?.employer_name || "",
    jobTitle: userDetails?.job_title || "",
    dateOfemployment: userDetails?.date_of_employment || "",
    individualId: userDetails?.id || -1,

    address: userDetails?.address || "",
    unitNumber: userDetails?.unit_number || "",
    buildingName: userDetails?.building_name || "",
    streetNumber: userDetails?.street_number || "",
    streetName: userDetails?.street_name || "",
    suburb: userDetails?.suburb || "",
    city: userDetails?.city || "",
    province: userDetails?.province || "",
    country: userDetails?.country || "",
    areaCode: userDetails?.area_code || "",
  });

  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  function submitSingle(e) {
    e.preventDefault();
    setIsLoading(true);
    let shouldProceed = true;

    if (
      data.identificationType === "nationalid" &&
      !validateZimbabweanID(data.identificationNumber)
    ) {
      toast.error("Invalid national id number");
      shouldProceed = false;
    }
    if (
      data.mobileNumber.length < 10 ||
      data.mobileNumber.length > 13 ||
      /\D/.test(data.mobileNumber)
    ) {
      toast.error("Mobile number must be between 10 and 13 digits");
      shouldProceed = false;
    }

    if (!shouldProceed) {
      setIsLoading(false);
      return;
    }

    post(reverseUrl(url), {
      onError: (e) =>
        toast.error(
          "Error adding individual! " + truncate(userFriendlyErrorOrResponse(e), { length: 40 })
        ),
      onFinish: () => setIsLoading(false),
      onSuccess: () => {
        reset();
        toast.success("Individual added!");
        handleClose();
      },
    });
  }

  function handleEdit(e) {
    e.preventDefault();
    setIsLoading(true);

    const uri =
      action === "edit-agent" ? reverseUrl("edit-agent") : reverseUrl("edit_individual_user");

    axios
      .post(uri, data)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(res.data.message);
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
        } else toast(userFriendlyErrorOrResponse(res.data));
      })
      .catch((error) => toast.error("An error occurred: " + userFriendlyErrorOrResponse(error)))
      .finally(() => setIsLoading(false));
  }

  return {
    data,
    errors,
    isLoading,
    handleEdit,
    submitSingle,
    changeHandler,
  };
}
