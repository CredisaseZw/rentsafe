import { useQuery } from "@tanstack/react-query";
import type { PropertyTypeResponse } from "@/types";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";

export default function getPropertyTypes() {
  const persistentData = getPersistentData();
  const cachedPropertyTypes = persistentData?.propertyTypes;

  const { data, isLoading, error } = useQuery<PropertyTypeResponse>({
    queryKey: ["property_types"],
    queryFn: async () => {

      if (cachedPropertyTypes) return cachedPropertyTypes;
      const response = await api.get<PropertyTypeResponse>("/api/properties/property-types/");
      savePersistentData("propertyTypes", response.data); 
      return response.data;
    },
  });

  return { data, isLoading, error };
}
