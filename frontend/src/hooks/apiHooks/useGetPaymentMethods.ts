import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";

export default function useGetPaymentMethods(){  
    const {data, isLoading, error} = useQuery({
        queryKey : ["payment_methods"],
        queryFn : async() =>{
            const persistentData = getPersistentData();
            const cachedPaymentMethods = persistentData?.paymentMethods
            
            if(cachedPaymentMethods) return cachedPaymentMethods;
         
            const response = await api.get("/api/accounting/payment-methods/")
            savePersistentData("paymentMethods",response.data);
            return response.data
        }
    })

    return {
        data, isLoading, error
    }
}