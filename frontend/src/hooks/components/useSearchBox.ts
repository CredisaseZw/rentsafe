import { useState } from "react";
import { useSearchParams } from "react-router";

export default function useSearchBox(){
    const [searchValue, setSearchValue] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleOnSearchValue = () =>{
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (searchValue) params.set("search", searchValue);
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