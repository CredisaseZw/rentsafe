import React, { useState, useEffect } from "react";
import type { FilterOptionType, SummaryCardType } from "@/types";

function usePropertyList() {
   const [addPropertyModal, setAddPropertyModal] = useState(false);
   const [SummaryCards, setSummaryCards] = useState<SummaryCardType[]>([]);

   const [filterOptions, setFilterOptions] = useState<FilterOptionType[]>([]);
   const [selectedFilter, setSelectFilter] = useState(filterOptions[0].value);
   const [addPropertyForm, setAddPropertyForm] = useState({
      property_type: "",
      unit_number: "",
      building_name: "",
      street_number: "",
      street_name: "",
      area: "",
      city_town: "",
      province: "",
      country: "",
      area_code: "",
      lanlord_type: "",
      landlord_id: "",
      landlord_name: "",
      property_details: "",
   });

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setAddPropertyForm((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const submitAddPropertyForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(addPropertyForm);
   };

   const onSelectFilter = (filterOption: string) => {
      setSelectFilter(filterOption);
   };

   const onSearchValue = (searchValue: string) => {
      console.log("SERACHING VALUE " + searchValue);
   };

   const openModal = () => {
      setAddPropertyModal(true);
   };

   const closeModal = () => {
      setAddPropertyModal(false);
   };

   // REMOVE THIS WITH BACKEND DATA
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
      onChangeHandler,
      onSearchValue,
      onSelectFilter,
      submitAddPropertyForm,
      openModal,
      closeModal,
      addPropertyForm,
      addPropertyModal,
      filterOptions,
      SummaryCards,
      selectedFilter,
   };
}

export default usePropertyList;
