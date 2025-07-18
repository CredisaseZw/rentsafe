import React, { useState } from "react"

function usePropertyList() {
    let [addPropertyModal, setAddPropertyModal] = useState(false);
    let [SummaryCards, setSummaryCard] = useState([ { subTitle: "Total Properties", value: 35 },
      { subTitle: "Occupied", value: 28 },
      { subTitle: "Vacant", value: 5 },
      { subTitle: "Maintenance", value: 2 },
      { subTitle: "Monthly Revenue", value: "$8,500" },])

    let [filterOptions, setFilterOptions] = useState([
        { label: "All Properties", value: "all_properties" },
        { label: "Occupied", value: "occupied" },
        { label: "Vacant", value: "vacant" },
    ])
    let [selectedFilter, setSelectFilter] = useState(filterOptions[0].value)
    let [addPropertyForm, setAddPropertyForm] = useState({
        property_type: '',
        unit_number: '',
        building_name: '',
        street_number: '',
        street_name: '',
        area: '',
        city_town: '',
        province: '',
        country: '',
        area_code: '',
        lanlord_type: '',
        landlord_id: '',
        landlord_name: '',
        property_details: '',
    })

    let onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setAddPropertyForm(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let submitAddPropertyForm = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        console.log(addPropertyForm);
    }

    let onSelectFilter = (filterOption: string) =>{
        setSelectFilter(filterOption)
    }

    let onSearchValue = (searchValue:string) =>{
        console.log("SERACHING VALUE " + searchValue)
    }

    let openModal = () =>{
        setAddPropertyModal(true);
    }

    let closeModal = () =>{
        setAddPropertyModal(false);
    }

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
        selectedFilter
    }
}

export default usePropertyList