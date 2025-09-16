import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useGetPropertyUnits(property_id: string | undefined) { 
    const {data, isLoading, error} = useQuery({
        queryKey: ["property-units", property_id],
        queryFn: async () => {
            if (!property_id) return null;
            const response = await api.get(`/api/properties/${property_id}/units/`);
            return response.data;
        },
        enabled: !!property_id,
    })

    return {
        units: data,
        unitsLoading:  isLoading,
        unitsError :error,
    };
}