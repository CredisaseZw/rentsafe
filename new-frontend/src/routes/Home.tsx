import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home() {
   // redirect to services page until landing page is implemented
   const navigate = useNavigate();
   useEffect(() => void navigate("/services"));

   return <div>home page</div>;
}
