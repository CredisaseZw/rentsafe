import type { BranchFull, IndividualMinimal } from "@/interfaces";
import { extractAddresses, getFormDataObject, handleAxiosError, /* handleTrackChangedFields */ validateYear } from "@/lib/utils";
import type { AddPropertyForm, Payload, Property, PropertyType } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import getPropertyTypes from "../apiHooks/useGetPropertyTypes";
import useClient from "../general/useClient";
import { getPropertiesStore } from "@/store/propertiesStore";

function useCreateProperty(property?: Property | null) {
    const queryClient = useClient()
    const [loading, setLoading] = useState(false);
    const [landlordIdentifier, setLandlordIdentifier] = useState<string>("Name")
    const [searchItem, setSearchItem] = useState(property?.landlords?.[0]?.landlord_id ?? "");
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[] | null>(null)
    const {data, isLoading, error} = getPropertyTypes();
    const [addPropertyForm, setAddPropertyForm] = useState<AddPropertyForm>({
        property_type: String((property?.property_type as PropertyType)?.id) ?? "", 
        landlord_type: property?.landlords?.[0]?.landlord_type ?? "individual",
        landlord_id: property?.landlords?.[0]?.landlord_id ?? "", 
        landlord_name: property?.landlords?.[0]?.landlord_name ?? "",  
        status : property?.status ?? "", 
        is_furnished : property?.is_furnished ?? false, 
        features : {
            parking : property?.features?.parking ?? "",
            security: property?.features?.security ?? "",
            backup_power: property?.features?.backup_power ?? ""
        }
    });

    useEffect(()=>{
      if(handleAxiosError("Failed to fetch property types", error)) return;
      if (data) { setPropertyTypes(data.results ?? []); }
    }, [data, error])
  

   const onSelectChange = (name: string, value: string) => {
        setAddPropertyForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFeatureChange = (feature: string, value: string) => {
        setAddPropertyForm((prev) => ({
            ...prev,
            features: {
            ...prev.features,
            [feature]: value,
            },
        }))
    };

    const onSelectValue = (item: IndividualMinimal | BranchFull)=>{
        if ("first_name" in item) {
            setAddPropertyForm((prev) => ({
            ...prev,
            landlord_id: item.identification_number,
            landlord_name: `${item.first_name} ${item.last_name}`,
            }));
            return;
        }

        setAddPropertyForm((prev) => ({
            ...prev,
            landlord_id: item.company.registration_number,
            landlord_name: item.company.registration_name,
        }));
    }
    
    const handleAddProperty = (
        newProperty:  UseMutationResult<any, Error, any, unknown>, 
        e: React.FormEvent<HTMLFormElement>,
        successCallback:()=>void) => {

        e.preventDefault();      
        const data = getFormDataObject(e);
        const addresses = extractAddresses(data);
        const mode = property ? "update" : "create";
        //let changed;
        if (data.year_built && (data.year_built as string).length > 0) {
            if (!validateYear(data.year_built as string)) {
            toast.error("Invalid Year", {
                description: `${data.year_built} is not a valid year.`,
            });
            return; 
            }
        }

        setLoading(true)
        const landlords = [
            addPropertyForm.landlord_name.length !== 0 &&
                {
                    landlord_name: addPropertyForm.landlord_name,
                    landlord_type: addPropertyForm.landlord_type,
                    landlord_id: addPropertyForm.landlord_id,
                },
            ].filter(Boolean)

        const features ={
            parking: addPropertyForm.features.parking,
            security: addPropertyForm.features.security,
            backup_power: addPropertyForm.features.backup_power
        }
        const propertyPayload = {
            name: data.building_name ?? "",
            description: data.property_details,
            status: addPropertyForm.status,
            year_built: Number(data.year_built),
            total_area: data.total_area,
            is_furnished: addPropertyForm.is_furnished,
            total_number_of_units: parseInt(data.total_number_of_units as string) ?? 0,
            features: features, 
            property_type_id: parseInt(addPropertyForm.property_type),
            addresses_input: addresses[0],
            landlords_input: landlords
        };
        /* if(mode === "update"){
            const addresses_ = property?.addresses?.map((a)=>({
                is_primary: !a.is_primary,
                address_type: a.address_type,
                postal_code: !a.postal_code ? "" : a.postal_code,
                suburb_id: String(a.suburb?.id),
                street_address : a.street_address
            }))
            const landlords_ = property?.landlords?.map((l)=>({
                landlord_name: l.landlord_name,
                landlord_type: l.landlord_type,
                landlord_id: l.landlord_id,
            }))
         
            const updatePayload = {
                name: property?.name,
                description: property?.description,
                status: property?.status,
                year_built: property?.year_built,
                total_area: property?.total_area,
                is_furnished: property?.is_furnished,
                total_number_of_units: property?.total_number_of_units ,
                features: {
                    park3ing: property?.features?.parking,
                    security: property?.features?.security,
                    backup_power: property?.features?.backup_power
                },
                property_type_id: (property?.property_type as PropertyType).id,
                addresses_input: addresses_?.[0],
                landlords_input: landlords_
            };   

            changed = handleTrackChangedFields(updatePayload, propertyPayload)
            if(changed.addresses_input) changed.addresses_input = addresses[0];
            if(changed.landlords_input) changed.landlords_input = landlords;
            if(changed.features) changed.features = features;
            
        }
 */
        const PAYLOAD:Payload = {
            ...(
                mode === "update" && {
                    id : Number(property?.id),
                }
            ),
            data: propertyPayload,
            mode
        }
        
        newProperty.mutate(PAYLOAD, {
            onError: (error) => {handleAxiosError("Failed to create property.", error, "Failed to create property. Please try again.")},
            onSuccess: () => {
                setLoading(false);
                toast.success("Property successfully created")
                if(mode === "create"){
                    getPropertiesStore?.();
                }else{
                    queryClient.invalidateQueries({queryKey : ["property-details", String(property?.id)]});
                }
                successCallback()
            },
            onSettled: () => setLoading(false),
        });
    }
        
    return {
        addPropertyForm,
        landlordIdentifier,
        searchItem,
        loading,
        isLoading,
        propertyTypes,
        onSelectValue,
        handleFeatureChange,
        handleAddProperty,
        setSearchItem, 
        onSelectChange, 
        setAddPropertyForm,
        setLandlordIdentifier,
    }
}

export default useCreateProperty