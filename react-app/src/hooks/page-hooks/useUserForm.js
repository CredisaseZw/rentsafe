import { useForm } from "@inertiajs/inertia-react";
import { capitalize } from "lodash";
import toast from "react-hot-toast";

export default function useUserForm(user, url, action, closeModal) {
  const { errors, data, processing, setData, post, put } = useForm({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    identificationNumber: user.identificationNumber || "",
    identificationType: user.identificationType || "",
    mobileNumber: user.mobile || "",
    userEmail: user.email || "",
    accessLevel: user.access_level || "",
    address: user.address || "",
    userId: user.userId || -1,
  });

  function handleAdd() {
    post(reverseUrl(url), {
      onSuccess: () => {
        toast.success(
          `${capitalize(data.firstName)} ${capitalize(data.lastName)}'s details were added successfully`
        );
        closeModal();
      },
      onError: () => {
        toast.error(`Error adding details`);
      },
    });
  }

  function handleEdit() {
    put(reverseUrl(url), {
      onSuccess: () => {
        toast.success(
          `${capitalize(data.firstName)} ${capitalize(data.lastName)}'s details were updated successfully`
        );
        closeModal();
      },
      onError: () => {
        toast.error(`Error updating details`);
      },
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (action === "add") handleAdd();
    else handleEdit();
  }

  return {
    data,
    errors,
    isLoading: processing,
    handleSubmit,
    changeHandler: (e) => setData({ ...data, [e.target.id]: e.target.value }),
  };
}
