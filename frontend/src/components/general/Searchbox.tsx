import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSearchBox from "@/hooks/components/useSearchBox";
interface SearchboxProps {
   placeholder: string;
}

function Searchbox({ placeholder }: SearchboxProps) {
  const {
    searchValue,
    setSearchValue,
    onClearSearch,
    handleOnSearchValue,
  } = useSearchBox();

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchValue.trim()) return onClearSearch();
        handleOnSearchValue();
      }}
      className="
         self-center
        flex w-full py-1 h-fit max-w-full sm:max-w-md md:max-w-[300px]
        items-center
        rounded-md
        border
        border-color
        bg-white dark:bg-zinc-900
        overflow-hidden
      "
    >
      <Button
        onClick={onClearSearch}
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
      >
        <X className="text-gray-400" size={16} />
      </Button>

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        name="search_value"
        className="
          flex-1 min-w-0
          text-sm
          bg-transparent
          px-2 py-2
          text-gray-600
          placeholder-gray-400
          outline-none
          dark:text-gray-100
        "
      />

      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="shrink-0"
      >
        <Search className="text-gray-400" size={18} />
      </Button>
    </form>
  );
}
export default Searchbox;
