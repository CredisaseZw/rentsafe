import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";

export default function NotFound() {
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const goBack = () => navigate(-1);

   return (
      <div>
         <h1 className="mt-20 text-center text-2xl">
            <b>{pathname}</b> Not Found
         </h1>

         <p className="mt-4 text-center">This page is either still in development or does not exist.</p>

         <div className="mt-8 flex justify-center">
            <Button onClick={goBack}>Go Back</Button>
         </div>
      </div>
   );
}
