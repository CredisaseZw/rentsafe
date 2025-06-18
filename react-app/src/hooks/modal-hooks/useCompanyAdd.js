import toast from "react-hot-toast";
import { useForm } from "@inertiajs/inertia-react";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useCompanyAdd(url, companyData, handleClose, setFetchedData) {
  const {
    data,
    errors,
    processing: isLoading,
    setData,
    reset,
    post,
  } = useForm({
    note: companyData?.note || "",
    company_id: companyData?.id || "",
    branch: companyData?.branch || "",
    website: companyData?.website || "",
    landLine: companyData?.landline || "",
    industry: companyData?.industry || "",
    emailAddress: companyData?.email || "",
    is_gvt: companyData?.is_government || false,
    vatNumber: companyData?.vat_number || "",
    tinNumber: companyData?.tin_number || "",
    tradingName: companyData?.trading_name || "",
    mobileNumber: companyData?.mobile_phone || "",
    is_contracted: companyData?.is_contracted || false,
    registeredName: companyData?.registration_name || "",
    registrationDate: companyData?.registration_date || "",
    companyRegistrationNumber: companyData?.registration_number || "",

    currentAddress: companyData?.address || "",
    unitNumber: companyData?.unit_number || "",
    buildingName: companyData?.building_name || "",
    streetNumber: companyData?.street_number || "",
    streetName: companyData?.street_name || "",
    suburb: companyData?.suburb || "",
    city: companyData?.city || "",
    province: companyData?.province || "",
    country: companyData?.country || "",
    areaCode: companyData?.area_code || "",
  });

  function changeHandler(e) {
    if (e.target.id === "is_gvt") {
      setData({ ...data, [e.target.id]: e.target.checked });
    } else {
      setData({ ...data, [e.target.id]: e.target.value });
    }
  }

  function handleEdit(e) {
    e.preventDefault();

    data.registeredName = data.branch
      ? `${data.registeredName.split(" - ")[0]} - ${data.branch}`
      : data.registeredName;

    post(reverseUrl("edit_company_user"), {
      onSuccess(res) {
        if (res?.status === "success") {
          toast.success(res.data.message);
          setFetchedData((prev) => {
            const oldData = prev.filter((company) => company.id !== data.company_id);
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
          reset();
          handleClose();
        } else toast.error(userFriendlyErrorOrResponse(res));
      },
    });
  }

  function submitSingle(e) {
    e.preventDefault();
    data.registeredName += data.branch ? " - " + data.branch : "";

    post(reverseUrl(url), {
      onSuccess(res) {
        if (res.props.success) {
          reset();
          handleClose();
          toast.success(res.props.success);
        } else toast.error(userFriendlyErrorOrResponse(res));
      },
      onError(e) {
        toast.error(userFriendlyErrorOrResponse(e));
      },
    });
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
