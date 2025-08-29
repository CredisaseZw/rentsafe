import { useState, useRef } from "react";
import type { AddPropertyForm, DashboardCardProp, Option, Header, Property, PropertyType } from "@/types";
import type { BranchFull, IndividualMinimal, PaginationData } from "@/interfaces";
import { BadgeCent, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";
import { useSearchParams } from "react-router";
import type { UseMutationResult } from "@tanstack/react-query";
import { extractAddresses } from "@/lib/utils";
import { isAxiosError, type AxiosError } from "axios";
import { toast } from "sonner";

function usePropertyList() {
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
   
   const parkingOptions = useRef<Option[]>([
      { label: "Underground", value: "underground" },
      { label: "Open", value: "open" },
      { label: "Street", value: "street" },
   ])
   const securityOptions = useRef<Option[]>([
      { label: "24/7", value: "24/7" },
      { label: "Daytime", value: "daytime" },
      { label: "None", value: "none" },
   ])
   const backupPowerOptions = useRef<Option[]>([
      { label: "Generator", value: "generator" },
      { label: "Solar", value: "solar" },
      { label: "None", value: "none" },
   ])
   const Options = useRef<Option[]>([
      { label: "Default", value: "default" },
      { label: "Occupied", value: "occupied" },
      { label: "Vacant", value: "vacant" },
   ]);
   const statusOptions = useRef<Option[]>([
      {label : "Active", value : "active"},
      {label : "In-active", value : "inactive"}
   ])
   const [selectedFilter, setSelectFilter] = useState("all_properties");
   const [status, setStatus] = useState({ loading: true, isError: false });
   const [landlordIdentifier, setLandlordIdentifier] = useState<string>("Name")
   const [searchItem, setSearchItem] = useState("");
   const [propertyTypes, setPropertyTypes] = useState<PropertyType[] | null>(null)
   const [loading, setLoading] = useState(false);
   const [searchParams, setSearchParams] = useSearchParams();
   const page = parseInt(searchParams.get("page") || "1");
   const search = searchParams.get("search") || "";
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
   const onSearchValue = (searchValue: string) => {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         if (searchValue) params.set("search", searchValue);
         else params.delete("search");
         return params;
      }); 
   };
   
   const onClearSearch = () => {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         if (params.get("search")) params.delete("search");
         return params;
      });
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

   const openModal = () => setAddPropertyModal(true);
   const closeModal = () => setAddPropertyModal(false);

   const handleAddProperty = (newProperty:  UseMutationResult<any, Error, any, unknown>, e: React.FormEvent<HTMLFormElement>, successCallback:()=>void) => {
      e.preventDefault();      
      setLoading(true)
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const addresses = extractAddresses(data);
      
      const property = {
         name: data.building_name,
         description: data.property_details,
         status: addPropertyForm.status,
         year_built: parseInt(data.year_built as string),
         total_area: data.total_area,
         is_furnished: addPropertyForm.is_furnished,
         total_number_of_units: parseInt(data.total_number_of_units as string),
         features: {
            parking: addPropertyForm.features.parking,
            security: addPropertyForm.features.security,
            backup_power: addPropertyForm.features.backup_power
         },
         property_type_id: parseInt(addPropertyForm.property_type),
         addresses_input: addresses[0],
         landlords_input: [
            {
               landlord_name: addPropertyForm.landlord_name,
               landlord_type: addPropertyForm.landlord_type,
               landlord_id: addPropertyForm.landlord_id
            }
         ]
      };

      try{
      newProperty.mutate(property, {
         onError: (error: AxiosError |Error | unknown) => {
            if (isAxiosError(error)) {
            console.error("Full backend response:", error.response?.data);
            const errorDetails = error.response?.data?.error || "Unknown error";
            toast.error("Failed to create property", { description: errorDetails });
            return;
            }
            toast.error("Failed to create property. Please try again.");
         },
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
   return {
      headers,
      properties,
      paginationData,
      SummaryCards,
      addPropertyModal,
      status,
      addPropertyForm,
      Options,
      selectedFilter,
      landlordIdentifier,
      searchItem,
      propertyTypes,
      loading,
      page,
      search,
      securityOptions,
      parkingOptions,
      backupPowerOptions,
      statusOptions,
      onSelectValue,
      handleAddProperty,
      handleFeatureChange,
      setSummaryCards,
      onClearSearch,
      setLoading,
      setPropertyTypes,
      setSearchItem,
      setLandlordIdentifier,
      setProperties,
      setAddPropertyForm,
      setPaginationData,
      setStatus,
      onInputChange,
      onSelectChange,
      onSearchValue,
      onSelectFilter,
      openModal,
      closeModal
   };
}

export default usePropertyList;
