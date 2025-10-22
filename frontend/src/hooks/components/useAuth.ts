import type { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { getCookie, setCookie } from "typescript-cookie";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AuthProps } from "../apiHooks/useLogin";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function useAuth() {
   const [error, setError] = useState<string | null>(null)
   const [isLogin, setIsLogin] = useState(false);
   const navigate = useNavigate();
   const {currencies, onCurrencyRetch} = useCurrency()
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


   const onLogin = (
      e: React.FormEvent<HTMLFormElement>, 
      login: UseMutationResult<{
         id: any;
         username: any;
         is_verified: any;
         user_type: any;
      }, Error, AuthProps, unknown>
   ) => {
      setIsLogin(true);
      e.preventDefault();

      const isValid = validateForm();
      if (!isValid.isUsername || !isValid.isPassword) return;

      login.mutate(loginForm, {
         onSuccess: (data) => {
            if(data.is_verified){
               if(currencies.length === 0) onCurrencyRetch?.();
               if(!getCookie("token")) setCookie("token", JSON.stringify(data), { expires: 4 });
               const next = new URLSearchParams(location.search).get("next");
               navigate(next || "/services/rent-safe", { replace: true });
            } else{
               setError("Account is Not verified")
            }
         },
         onError: (error) => {
            if(isAxiosError(error)){
               setError(error.response?.data.error ?? error.response?.data.detail);
            }
            console.log(error);
         },
         onSettled: () => setIsLogin(false),
      });
   };

   return {
      error,
      isLogin,
      loginForm,
      handleChange, 
      onLogin,
   };
}
