import type { MinimalUnit, Property, SelectedFeature } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useClient from "../general/useClient";
import { extractFeatures, getFormDataObject, handleAxiosError } from "@/lib/utils";
import useGetPropertyUnits from "../apiHooks/useGetPropertyUnits";
import useGetPropertyDetails from "../apiHooks/useGetPropertyDetails";

export default function useProperty(){
    const {property_id} = useParams<{property_id:string}>()
    const [open, setOpen] = useState(false) ;
    const [property, setProperty] = useState<Property | null>(null)
    const [propertyUnits, setPropertyUnits] = useState<MinimalUnit[]>([])
    const [loading, setLoading] = useState(false);
    const [selectedList, setSelectedList] = useState<SelectedFeature[]>([])
    const useQueryClient = useClient();
    const {propertyData, propertyDataLoading , propertyDataError } = useGetPropertyDetails(property_id);
    const {units, unitsLoading, unitsError} = useGetPropertyUnits(property_id);

    useEffect(()=>{
        if (handleAxiosError("Failed to fetch property details", propertyDataError)) return;
        if(propertyData)setProperty(propertyData)
    }, [propertyData, propertyDataError])

    useEffect(()=>{
        if (handleAxiosError("Failed to fetch property units", unitsError)) return;
        if(units) setPropertyUnits(units) 
    }, [units, unitsError]) 

    const handleAddUnit =(
        UNIT:  UseMutationResult<any, Error, any, unknown>,
        e: React.FormEvent<HTMLFormElement>,
        onSuccessCallback : () => void) => {

        e.preventDefault()
        setLoading(true);
        const data = getFormDataObject(e);
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
            onError: (error) => {handleAxiosError("Failed to add unit", error)},
            onSettled: () => setLoading(false)
        }) 
    }
    
    return{
        property_id,
        propertyUnits,
        property,
        open,
        loading,
        propertyDataLoading,
        unitsLoading,
        selectedList,
        propertyData,
        unitsError, 
        setSelectedList,
        setOpen,
        handleAddUnit,
        setProperty,
        setPropertyUnits,

    }

}