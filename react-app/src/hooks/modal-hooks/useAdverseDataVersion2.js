import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { truncate } from "lodash";
import { userFriendlyErrorOrResponse } from "../../utils";

export default function useAdverseDataVersion2(auth) {
  const [tenantType, setTenantType] = useState("");
  const [processing, setProcessing] = useState(false);

  const data_source = `${auth.user_profile.first_name} ${auth.user_profile.last_name} - ${auth.user_profile.individual_id}`;
  const creditor = `${auth.company.company_id ? auth.company.company_name + " - " + auth.company.company_id : data_source}`;
  const creditor_id = auth.company.company_id || user_profile.individual_id;

  function axios_post(url, data) {
    setProcessing(true);

    axios
      .post(url, data)
      .then(() => {
        toast.success("claim submitted!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error submitting claim. " + truncate(userFriendlyErrorOrResponse(error, 30)));
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleSingleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data["creditor_id"] = creditor_id;
    data["data_source"] = data_source;
    axios_post(reverseUrl("create_claim"), data);
  }

  return {
    creditor,
    processing,
    tenantType,
    setTenantType,
    handleSingleSubmit,
  };
}
