import type { MinimalUnit, Property, SelectedFeature } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useClient from "../general/useClient";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { extractFeatures } from "@/lib/utils";

export default function useProperty(){
    const {property_id} = useParams<{property_id:string}>()
    const [open, setOpen] = useState(false) ;
    const [property, setProperty] = useState<Property | null>(null)
    const [propertyUnits, setPropertyUnits] = useState<MinimalUnit[]>([])
    const [loading, setLoading] = useState(false);
    const [selectedList, setSelectedList] = useState<SelectedFeature[]>([])
    const useQueryClient = useClient();
     
    const handleAddUnit =(
        UNIT:  UseMutationResult<any, Error, any, unknown>,
        e: React.FormEvent<HTMLFormElement>,
        onSuccessCallback : () => void) => {

        e.preventDefault()
        setLoading(true);
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries());
        const features = extractFeatures(selectedList);
        
        const unitData = {
            unit_number: data.unitNumber?.toString().trim(),
            unit_type: data.unitType?.toString(),
            number_of_rooms: Number(data.numberOfRooms),
            status: data.status.toString(),
            features: features 
        }

        UNIT.mutate(unitData, {
            onSuccess: () => {
                useQueryClient.invalidateQueries({ queryKey: ["property-units", property_id] })
                onSuccessCallback()
                setSelectedList([])
            },
            onError: (error) => {
                if(isAxiosError(error)){
                    const message = error.response?.data.error ?? error.response?.data.detail ?? "Something went wrong"
                    toast.error("Failed to add unit", {description : message})
                    console.error("Full backend response:", error.response?.data);
                }
             },
            onSettled: () => setLoading(false)
        }) 
    }
    
    return{
        property_id,
        propertyUnits,
        property,
        open,
        loading,
        selectedList, 
        setSelectedList,
        setOpen,
        handleAddUnit,
        setProperty,
        setPropertyUnits,

    }

}