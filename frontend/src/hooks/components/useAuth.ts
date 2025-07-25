import React from "react";
import { useState } from "react";

export default function useAuth() {
   const [status, setStatus] = useState({
      error: false,
      isAccount: false,
   });
   const [loginForm, setLoginForm] = useState({
      username: "",
      password: "",
   });

   const validateForm = () => ({
      isUsername: loginForm.username.trim().length > 0,
      isPassword: loginForm.password.trim().length > 0,
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const onError = (key: "error" | "isAccount") => {
      setStatus((prev) => ({
         ...prev,
         [key]: !prev[key],
      }));
   };

   return {
      loginForm,
      status,
      validateForm,
      handleChange,
      onError,
   };
}
