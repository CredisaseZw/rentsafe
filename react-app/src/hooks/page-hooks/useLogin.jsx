import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { toast } from "react-hot-toast";

export default function useLogin(flash, error) {
  const [isLoading, setIsLoading] = useState(false);
  const [flashed, setFlashed] = useState(false);
  const { data, setData, post } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error?.type) toast[error.type](error.message);
    if (flash?.type === "success" && !flashed) {
      toast.success(flash.message);
      setFlashed(true);
    }
  }, [error, flash]);

  function changeHandler(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function forgotPasswordHandler() {
    if (!data.email) {
      toast.error("Enter your email");
      return;
    }

    post(reverseUrl("forgot_password"), {
      onStart() {
        setIsLoading(true);
      },
      onError(err) {
        console.log(err);
        toast.error("something went wrong");
        setIsLoading(false);
      },
      onSuccess(res) {
        if (res?.props?.success) {
          toast.success(res.props.success.message);
        }
        setIsLoading(false);
      },
    });
  }

  function submitHandler(e) {
    e.preventDefault();

    post(reverseUrl("login"), {
      onStart() {
        setIsLoading(true);
      },
      onSuccess(res) {
        console.log(res);
        setIsLoading(false);
      },
      onError(err) {
        console.log(err);
        setIsLoading(false);
      },
    });
  }

  return {
    data,
    isLoading,
    submitHandler,
    changeHandler,
    forgotPasswordHandler,
  };
}
