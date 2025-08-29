import type { Header } from "@/types"


export default function useCombined(){

    const headers:Header[] = [
        {
            name: "Landlord",
        },
        {
            name: "Address Inspected",
            textAlign: "left"
        },
        {
            name: "Property Type",
            textAlign: "left"
        },
        {
            name: "Inspector",
            textAlign: "left"
        },
        {
            name: "Inspection Date",
        },
        {
            name: "Score",
        },
        {
            name: "Previous Inspection Date",
        },
        {
            name: "Score",
        },
         {
            name: "Actions",
        }
    ]

    return {
        headers
    }


}