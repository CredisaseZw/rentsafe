import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchboxProps {
   placeholder: string;
   handleSearch: (value: string) => void;
}
function Searchbox({ handleSearch, placeholder }: SearchboxProps) {
   const [searchValue, setSearchValue] = useState("");
   return (
      <div className="w-full">
         <div className="flex flex-row items-center rounded">
            <button className="flex items-center gap-2 rounded-tl rounded-bl border border-green-600 bg-green-600 px-4 py-2 text-white">
               <span>Search</span>
               <SearchIcon size={15} />
            </button>
            <input
               type="text"
               className="flex-1 rounded-r-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
               placeholder={placeholder}
               value={searchValue}
               onChange={(e) => setSearchValue(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     handleSearch(searchValue);
                  }
               }}
            />
         </div>
      </div>
   );
}

export default Searchbox;
