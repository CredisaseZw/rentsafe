import React, { useEffect, useState } from "react";

function useContractorManagement() {
   const [isModal, setIsModal] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>();
   const [contractor, setContractor] = useState({
      contractorIndustry: "",
      ID_REG: "",
      name: "",
      mobileNumber: "",
      telephoneNumber: "",
      email: "",
      contactPerson: "",
      contactMobileNumber: "",
      contactEmail: "",
      propertyType: "",
      noOfRooms: "",
      otherPropertyDetails: "",
      unitNumber: "",
      buildingName: "",
      streetNumber: "",
      streetName: "",
      suburb: "",
      city: "",
      province: "",
      country: "",
      areaCode: "",
      chargeCurrency: "",
      standardRate: "",
      emergencryRate: "",
      licenseNumber: "",
   });
   const openModal = () => setIsModal(true);
   const closeModal = () => setIsModal(false);

   const onChangeHandler = (
      e:
         | React.ChangeEvent<HTMLInputElement>
         | React.ChangeEvent<HTMLTextAreaElement>
         | React.ChangeEvent<HTMLSelectElement>,
   ) => {
      setContractor((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const uploadContractorHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(contractor);
   };

   useEffect(() => {
      setIsLoading(false);
   }, []);
   return {
      isModal,
      contractor,
      isLoading,
      onChangeHandler,
      openModal,
      closeModal,
      uploadContractorHandler,
   };
}

export default useContractorManagement;
