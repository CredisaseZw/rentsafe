import { SearchIcon } from 'lucide-react'
import React, { useState } from 'react'

interface SearchboxProps{
    placeholder : string,
    handleSearch : (value: string) => void;
}
function Searchbox({handleSearch, placeholder}:SearchboxProps) {
    let [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full">
        <div className="flex flex-row items-center border-2 border-PRIMARY rounded">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2">
                <span>Search</span>
                <SearchIcon size={15} />
            </button>
            <input
                type="text"
                className="flex-1 px-3 py-2 focus:outline-none focus:ring-2 focus:border-PRIMARY"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e)=> setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(searchValue);
                    }
                }}
            />
        </div>
    </div>

  )
}

export default Searchbox