import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";


export default function useAddUnit(property_id: string | undefined) {
    return useMutation({
        mutationFn: async (unitData: { [key: string]: any }) => {
            if (!property_id) throw new Error("Property ID is required");
            const response = await api.post(`/api/properties/${property_id}/units/`, unitData);
            return response.data;
        },
    });
}