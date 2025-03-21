import { useForm, usePage } from "@inertiajs/inertia-react";
import { useState } from "react";

export default function useAdverseData() {
  const auth = usePage().props.Auth;
  const form = useForm();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  const data_source = `${auth.user_profile.first_name} ${auth.user_profile.last_name} - ${auth.user_profile.individual_id}`;
  const creditor = `${auth.company.company_id ? auth.company.company_name + " - " + auth.company.company_id : data_source}`;
  const creditor_id = auth.company.company_id || user_profile.individual_id;

  const closeModal = () => setShow(false);
  const openModal = () => setShow(true);
  const showSingleTab = () => setActiveTab("single");
  const showMultipleTab = () => setActiveTab("multiple");

  function handleSingleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data["creditor_id"] = creditor_id;
    data["data_source"] = data_source;
    console.log(data);

    form.post(reverseUrl("create_claim"), data);
  }

  function handleMultipleSubmit(e) {
    e.preventDefault();
    console.log("multple submission");
  }

  return {
    show,
    openModal,
    closeModal,
    activeTab,
    showSingleTab,
    showMultipleTab,
    handleSingleSubmit,
    handleMultipleSubmit,
    creditor,
    data_source,
    form,
  };
}
