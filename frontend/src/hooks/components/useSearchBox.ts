import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useURLParamFilter from "./useURLParamFilter";

export default function useSearchBox(){
    const [searchValue, setSearchValue] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const {getUrlParams} = useURLParamFilter()

    useEffect(()=>{
        const params = getUrlParams()
        if(params.search){
            setSearchValue(params.search.trim())
        }
    }, [])

    const handleOnSearchValue = () =>{
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (searchValue) params.set("search", searchValue.trim());
            else params.delete("search");
            return params;
        }); 
    }

    const onClearSearch = () => {
        setSearchValue("");
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (params.get("search")) params.delete("search");
            return params;
        });
   };

   return{
    searchValue,
    searchParams,
    setSearchValue,
    onClearSearch,
    handleOnSearchValue,
   }
}