import { useState, useEffect } from "react";
import type { AddPropertyForm, FilterOptionType, Header, Property, PropertyType } from "@/types";
import type { PaginationData } from "@/interfaces";
import { BadgeCent, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";
import { useSearchParams } from "react-router";

function usePropertyList() {
   const [addPropertyModal, setAddPropertyModal] = useState(false);
   const [SummaryCards, setSummaryCards] = useState<any>([]);
   const [filterOptions, setFilterOptions] = useState<FilterOptionType[]>([]);
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
   const onSelectFilter = (filterOption: string) => setSelectFilter(filterOption);
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

   const openModal = () => setAddPropertyModal(true);
   const closeModal = () => setAddPropertyModal(false);

   useEffect(() => {
      setSummaryCards([
         {  subTitle: "Total Properties", 
            value: 35,
            layout : {
               icon: HouseIcon,
               color: "blue",
            }
         },
         {  subTitle: "Occupied",
            value: 28,
            layout : {
               icon: Users,
               color: "indigo",
            }

          },
         {  subTitle: "Vacant",
            value: 5,
            layout :{
               icon: DoorOpen,
               color : "purple"
            }
          },
         { subTitle: "Maintenance",
            value: 2,
            layout : {
               icon : Wrench,
               color : "amber"
            }
          },
         {  subTitle: "Monthly Revenue",
            value: "$8,500",
            layout : {
               icon : BadgeCent,
               color : "green"
            }
         },
      ]);
      setFilterOptions([
         { label: "All Properties", value: "all_properties" },
         { label: "Occupied", value: "occupied" },
         { label: "Vacant", value: "vacant" },
      ]);
   }, []);

   return {
      headers,
      properties,
      paginationData,
      SummaryCards,
      addPropertyModal,
      status,
      addPropertyForm,
      filterOptions,
      selectedFilter,
      landlordIdentifier,
      searchItem,
      propertyTypes,
      loading,
      page,
      search,
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
