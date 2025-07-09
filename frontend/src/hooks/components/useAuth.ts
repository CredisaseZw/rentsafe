import React, { type HtmlHTMLAttributes } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function useAuth(){
    let navigation = useNavigate();
    let [loginForm, setLoginForm]  = useState({
        email : "",
        password : ""
    });

    const validateForm = () => ({
        isEmail: loginForm.email.trim().length > 0,
        isPassword: loginForm.password.trim().length > 0
    });

    let onLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = validateForm();
        if (isValid.isEmail && isValid.isPassword) {
            console.log(loginForm);
            navigation("/services/rent-safe")
        }
    }

    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setLoginForm(prev=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return {
        loginForm,
        onLogin,
        validateForm,
        handleChange
    }
}