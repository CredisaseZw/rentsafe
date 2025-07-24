import Logo from "@/components/general/Logo";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/components/useAuth";
import useLoginAuth from "@/hooks/apiHooks/useLogin";
import Alert from "@/components/general/Alerts";
import { useState } from "react";
import Spinner from "@/components/general/Spinner";

export default function Login() {
   const { loginForm, validateForm, handleChange, status, onError } = useAuth();
   const login = useLoginAuth();
   const [isLogin, setIsLogin] = useState(false);
   const navigate = useNavigate();

   const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
      setIsLogin(true);
      e.preventDefault();

      const isValid = validateForm();
      if (!isValid.isUsername || !isValid.isPassword) return;

      login.mutate(loginForm, {
         onSuccess: (data) => {
            localStorage.setItem("token", JSON.stringify(data));
            const next = new URLSearchParams(location.search).get("next");
            navigate(next || "/services/rent-safe", { replace: true });
         },
         onError: (error) => {
            console.log(error);
            onError("isAccount");
         },
         onSettled: () => setIsLogin(false),
      });
   };
   return (
      <div className={"bg-dark-body flex min-h-screen items-center justify-center"}>
         <div className="border-foreground/20 flex w-md flex-col items-center justify-center rounded-xl border bg-white/90 p-6 shadow-lg">
            <form onSubmit={onLogin} className="h-full w-full" method="post">
               <div className="mb-7">
                  <Logo />
                  <h2 className="mb-4 text-center text-lg">Login to proceed</h2>
               </div>
               <div className="flex w-full flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <input
                     className="input-default"
                     type="email"
                     autoComplete="email"
                     required
                     id="username"
                     name="username"
                     value={loginForm.username}
                     onChange={handleChange}
                  />
               </div>
               <div className="mt-5 flex w-full flex-col gap-2">
                  <label htmlFor="password">Password</label>
                  <input
                     className="input-default"
                     type="password"
                     required
                     name="password"
                     value={loginForm.password}
                     onChange={handleChange}
                  />
               </div>
               {status.isAccount && (
                  <div className="mt-7">
                     <Alert type="danger" message="Invalid account." />
                  </div>
               )}

               <div className="mt-7 flex w-full flex-col gap-3">
                  <button
                     type="submit"
                     disabled={isLogin}
                     className="bg-PRIMARY hover:bg-PRIMARY-DARK disabled:bg-primary-disabled me-2 mb-2 flex flex-row items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                     Sign in
                     {isLogin ? <Spinner /> : <LogInIcon size={15} className="self-center" />}
                  </button>
                  <Link to="" className="text-PRIMARY text-center text-sm font-semibold">
                     Forgot Password?
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
}
