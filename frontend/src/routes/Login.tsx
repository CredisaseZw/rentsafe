import Logo from "@/components/general/Logo";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import  useAuth from "@/hooks/components/useAuth";
import useLoginAuth from "@/hooks/apiHooks/useLogin";

export default function Login() {
   let {loginForm, validateForm, handleChange} = useAuth();
   let login = useLoginAuth();
   let navigate = useNavigate();
    
    let onLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

         let isValid = validateForm();
         if (!isValid.isUsername || !isValid.isPassword) return;

         login.mutate(loginForm, {
            onSuccess: (data)=>{
               localStorage.setItem("token", JSON.stringify(data))
               let next = new URLSearchParams(location.search).get("next");
               navigate(next || "/services/rent-safe", {replace : true})

            },
            onError:(error)=>{

            }
         })
        
    }
   return (
      <div className={"flex min-h-screen items-center justify-center bg-dark-body"}>
         <div className="border-foreground/20 border bg-white/90 w-md flex  flex-col items-center justify-center rounded-xl p-6 shadow-lg bg-white w">
            <form onSubmit={onLogin} className="w-full h-full" method="post">
               <div className="mb-7">
                  <Logo />
                  <h2 className="mb-4 text-center text-lg">Login to proceed</h2>
               </div>
                  <div className="w-full flex flex-col gap-2">
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
                  <div className="w-full mt-5 flex flex-col gap-2">
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

               <div className="mt-7 flex flex-col gap-3 w-full ">
                     <button type="submit" className="text-white gap-2 bg-PRIMARY hover:bg-PRIMARY-DARK focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 flex flex-row items-center justify-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >
                        Sign in
                        <LogInIcon size={15} className="flex self-center"/>
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
