import { useState, useEffect } from "react";
import type { FilterOptionType, Header, Property, SummaryCardType } from "@/types";
import type { PaginationData } from "@/interfaces";

function usePropertyList() {
   const [addPropertyModal, setAddPropertyModal] = useState(false);
   const [SummaryCards, setSummaryCards] = useState<SummaryCardType[]>([]);
   const [filterOptions, setFilterOptions] = useState<FilterOptionType[]>([]);
   const [selectedFilter, setSelectFilter] = useState("all_properties");
   const [status, setStatus] = useState({ loading: true, isError: false });
   const [addPropertyForm, setAddPropertyForm] = useState({
      property_type: "", unit_number: "", building_name: "", street_number: "", street_name: "",
      area: "", city_town: "", province: "", country: "", area_code: "",
      lanlord_type: "", landlord_id: "", landlord_name: "", property_details: "",
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
   const [paginationData, setPaginationData] = useState<PaginationData | null>(null);

   

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setAddPropertyForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const onSelectFilter = (filterOption: string) => setSelectFilter(filterOption);
   const onSearchValue = (searchValue: string) => console.log("SEARCHING VALUE:", searchValue);
   const openModal = () => setAddPropertyModal(true);
   const closeModal = () => setAddPropertyModal(false);

   useEffect(() => {
      setSummaryCards([
         { subTitle: "Total Properties", value: 35 },
         { subTitle: "Occupied", value: 28 },
         { subTitle: "Vacant", value: 5 },
         { subTitle: "Maintenance", value: 2 },
         { subTitle: "Monthly Revenue", value: "$8,500" },
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
      setProperties,
      setPaginationData,
      setStatus,
      onChangeHandler,
      onSearchValue,
      onSelectFilter,
      openModal,
      closeModal
   };
}

export default usePropertyList;
