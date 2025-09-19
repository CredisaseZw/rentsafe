import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useGetPropertyDetails(property_id: string | undefined) {
    const {data, isLoading, error} = useQuery({
        queryKey: ["property-details", property_id],
        queryFn: async () => {
            if (!property_id) return null;
            const response = await api.get(`/api/properties/${property_id}/`);
            return response.data;
        },
        enabled: !!property_id,
    })

    return {
        propertyData: data,
        propertyDataLoading:  isLoading,
        propertyDataError :error,
    };
} 