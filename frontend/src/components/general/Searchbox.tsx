import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface SearchboxProps {
   placeholder: string;
   handleSearch: (value: string) => void;
}

function Searchbox({ handleSearch, placeholder }: SearchboxProps) {
   const [searchValue, setSearchValue] = useState("");

   const clearSearch = () => {
      setSearchValue("");
   };

   return (
      <div className="border-color flex items-center h-fit self-center justify-between rounded-sm border bg-white sm:w-full md:w-fit dark:bg-zinc-900">
         <Button onClick={clearSearch} className="h-full" type="button" variant="ghost" size="xs">
            <X className="text-gray-400"/>
         </Button>
         <Input
            value={searchValue}
            onChange={(text) => setSearchValue(text.target.value)}
            placeholder={placeholder}
            name="search_value "
            className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-3 py-3 text-gray-900 placeholder-gray-400 ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 active:ring-0 active:outline-none dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
         />

         <Button
            className="text-gray-400"
            type="submit"
            onClick={() => {
               if (searchValue.trim()) handleSearch(searchValue.trim());
            }}
            variant="ghost"
            size="xs"
         >
            <Search />
         </Button>
      </div>
   );
}

export default Searchbox;
