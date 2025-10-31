import { useState, useEffect } from "react";
import type { AddPropertyForm, DashboardCardProp, Header, Property, PropertyType } from "@/types";
import type { BranchFull, IndividualMinimal, PaginationData } from "@/interfaces";
import { BadgeCent, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";
import { useSearchParams } from "react-router";
import type { UseMutationResult } from "@tanstack/react-query";
import { extractAddresses, getFormDataObject, handleAxiosError, validateYear } from "@/lib/utils";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import getPropertyTypes from "../apiHooks/useGetPropertyTypes";
import getPropertyList from "../apiHooks/useGetPropertyList";

function usePropertyList() {
   const [searchParams] = useSearchParams();
   const page = parseInt(searchParams.get("page") || "1");
   const search = searchParams.get("search") || "";
   const {data, isLoading, error} = getPropertyTypes();
   const { propertiesError, propertiesLoading, propertyRows, onPropertiesRetch } = getPropertyList(page, search ,true);
   const [addPropertyModal, setAddPropertyModal] = useState(false);
   const [SummaryCards, setSummaryCards] = useState<DashboardCardProp[]>(
      [
         {  subTitle: "Total Properties", 
            value: 35,
            layoutScheme : {
               icon: HouseIcon,
               color: "blue",
            }
         },
         {  subTitle: "Occupied",
            value: 28,
            layoutScheme : {
               icon: Users,
               color: "red",
            }

          },
         {  subTitle: "Vacant",
            value: 5,
            layoutScheme :{
               icon: DoorOpen,
               color : "purple"
            }
          },
         { subTitle: "Maintenance",
            value: 2,
            layoutScheme : {
               icon : Wrench,
               color : "amber"
            }
          },
         {  subTitle: "Monthly Revenue",
            value: "$8,500",
            layoutScheme : {
               icon : BadgeCent,
               color : "green"
            }
         },
      ]
   );
   
   const [selectedFilter, setSelectFilter] = useState("all_properties");
   const [status, setStatus] = useState({ loading: true, isError: false });
   const [landlordIdentifier, setLandlordIdentifier] = useState<string>("Name")
   const [searchItem, setSearchItem] = useState("");
   const [propertyTypes, setPropertyTypes] = useState<PropertyType[] | null>(null)
   const [loading, setLoading] = useState(false);
   const [addPropertyForm, setAddPropertyForm] = useState<AddPropertyForm>({
      property_type: "", 
      landlord_type: "individual",
      landlord_id: "", 
      landlord_name: "",  
      status : "", 
      is_furnished : false, 
      features : {
         parking : "",
         security: "",
         backup_power: ""
      }
   });

   const headers: Header[] = [
      { name: "Property No." },
      { name: "Property Name" },
      { name: "City/Town" },
      { name: "Suburb/Area" },
      { name: "Street Address" },
      { name: "Property Type" },
      { name: "Actions" }
   ];
   const [properties, setProperties] = useState<Property[]>([]);
   const [paginationData, setPaginationData] = useState<PaginationData | undefined>(undefined);

  
   useEffect(() => {
      if(handleAxiosError("Failed to fetch properties", propertiesError)) return;
      if (propertyRows) {
         setProperties(propertyRows.results ?? []);
         setPaginationData(propertyRows as PaginationData);
         setStatus({ loading: false, isError: false });
      }
   }, [propertyRows, propertiesError]);

   useEffect(()=>{
      if(handleAxiosError("Failed to fetch property types", error)) return;
      if (data) { setPropertyTypes(data.results ?? []); }
   }, [data, error])

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
   setAddPropertyForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
   }));
   };

   const onSelectChange = (name: string, value: string) => {
   setAddPropertyForm(prev => ({
      ...prev,
      [name]: value,
   }));
   };
   const onSelectFilter = (Option: string) => setSelectFilter(Option);
     const handleFeatureChange = (feature: string, value: string) => {
         setAddPropertyForm((prev) => ({
            ...prev,
            features: {
            ...prev.features,
            [feature]: value,
         },
      }))
   };

   const openModal = () => setAddPropertyModal(true);
   const closeModal = () => setAddPropertyModal(false);

   const handleAddProperty = (newProperty:  UseMutationResult<any, Error, any, unknown>, e: React.FormEvent<HTMLFormElement>, successCallback:()=>void) => {
      e.preventDefault();      
      const data = getFormDataObject(e);
      const addresses = extractAddresses(data);
      
      if (data.year_built && (data.year_built as string).length > 0) {
         if (!validateYear(data.year_built as string)) {
            toast.error("Invalid Year", {
               description: `${data.year_built} is not a valid year.`,
            });
            return; 
         }
      }
         
      setLoading(true)
      const property = {
         name: data.building_name ?? "",
         description: data.property_details,
         status: addPropertyForm.status,
         year_built: Number(data.year_built),
         total_area: data.total_area,
         is_furnished: addPropertyForm.is_furnished,
         total_number_of_units: parseInt(data.total_number_of_units as string) ?? 0,
         features: {
            parking: addPropertyForm.features.parking,
            security: addPropertyForm.features.security,
            backup_power: addPropertyForm.features.backup_power
         },
         property_type_id: parseInt(addPropertyForm.property_type),
         addresses_input: addresses[0],
         landlords_input: [
            addPropertyForm.landlord_id.length !== 0 &&
            addPropertyForm.landlord_name.length !== 0 &&
            {
               landlord_name: addPropertyForm.landlord_name,
               landlord_type: addPropertyForm.landlord_type,
               landlord_id: addPropertyForm.landlord_id,
            },
            ].filter(Boolean)
      };
   
      try{
      newProperty.mutate(property, {
         onError: (error: AxiosError |Error | unknown) => {handleAxiosError("Failed to create property", error, "Failed to create property. Please try again.")},
         onSuccess: () => {
            setLoading(false);
            toast.success("Property successfully created")
            successCallback()
         },
         onSettled: () => setLoading(false),
      });
      } catch (error ){
      console.error(error)
      setLoading(false)
      toast.error("Failed to create property. Internal Error.");
      }
   }
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
   return {
      headers,
      properties,
      paginationData,
      SummaryCards,
      addPropertyModal,
      status,
      addPropertyForm,
      selectedFilter,
      landlordIdentifier,
      searchItem,
      propertyTypes,
      loading,
      isLoading,
      page,
      search,
      propertiesLoading,
      onSelectValue,
      handleAddProperty,
      handleFeatureChange,
      setSummaryCards,
      setLoading,
      setPropertyTypes,
      setSearchItem,
      setLandlordIdentifier,
      setProperties,
      setAddPropertyForm,
      setPaginationData,
      onPropertiesRetch,
      setStatus,
      onInputChange,
      onSelectChange,
      onSelectFilter,
      openModal,
      closeModal
   };
}

export default usePropertyList;
