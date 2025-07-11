import { useState } from "react"

function usePropertyList() {

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

    let onSelectFilter = (filterOption: string) =>{
        setSelectFilter(filterOption)
    }

    let onSearchValue = (searchValue:string) =>{
        console.log("SERACHING VALUE " + searchValue)
    }
    return {
        onSearchValue,
        onSelectFilter,
        filterOptions,
        SummaryCards,
        selectedFilter
    }
}

export default usePropertyList