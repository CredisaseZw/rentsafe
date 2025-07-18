import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackBtn({ verbose }: { verbose?: boolean }) {
   const navigate = useNavigate();
   const goBack = () => navigate(-1);

   return (
      <Button onClick={goBack} size={verbose ? "default" : "sm"}>
         <ArrowLeft />
         {verbose ? " Go Back" : ""}
      </Button>
   );
}
