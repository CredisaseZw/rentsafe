import React, { type HtmlHTMLAttributes } from "react";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import useLoginAuth from "../apiHooks/useLogin";



export default function useAuth(){
    let navigation = useNavigate();
    let [loginForm, setLoginForm]  = useState({
        username : "",
        password : ""
    });

    const validateForm = () => ({
        isUsername: loginForm.username.trim().length > 0,
        isPassword: loginForm.password.trim().length > 0
    });

    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setLoginForm(prev=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return {
        loginForm,
        validateForm,
        handleChange
    }
}