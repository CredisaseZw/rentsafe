import React from "react";
import { useState } from "react";

export default function useAuth() {
   const [error, setError] = useState<string | null>(null)
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

   return {
      loginForm,
      error,
      validateForm,
      handleChange,
      setError,
   };
}
