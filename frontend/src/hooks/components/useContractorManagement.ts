import React, { useState } from "react"

function useContractorManagement() {
    let [isModal, setIsModal] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    let [contractor, setContractor] = useState({
        contractorIndustry:  "",
        ID_REG : "",
        name : "",
        mobileNumber : "",
        telephoneNumber  : "",
        email : "",
        contactPerson : "",
        contactMobileNumber : "",
        contactEmail : "",
        propertyType  : "",
        noOfRooms : "",
        otherPropertyDetails : "",
        unitNumber : "",
        buildingName : "",
        streetNumber : "",
        streetName : "",
        suburb  :  "",
        city : "",
        province :"",
        country :"",
        areaCode : "",
        chargeCurrency : "",
        standardRate : "",
        emergencryRate : "",
        licenseNumber : ""

    })
    let openModal = () => setIsModal(true);
    let closeModal = () => setIsModal(false);

    let onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setContractor(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let uploadContractorHandler = (e:  React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        console.log(contractor)
    }
   
    return {
        isModal,
        contractor,
        isLoading,
        onChangeHandler,
        openModal,
        closeModal,
        uploadContractorHandler
    }
}

export default useContractorManagement