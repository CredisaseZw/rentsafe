import { useNavigate } from "react-router";

export default function useSalesInvoice(){
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);

    return {
        handleGoBack
    }
}
