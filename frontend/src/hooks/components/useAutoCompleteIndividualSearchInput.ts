import React from "react";
import useMinimalIndividualsList from "../apiHooks/useMinimalIndividualsList";
import type { IndividualMinimal } from "@/interfaces";

export default function useAutoCompleteIndividualSearchInput() {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [open, setOpen] = React.useState(false);
   const [query, setQuery] = React.useState("");
   const [selectedIndividual, setSelectedIndividual] = React.useState<null | IndividualMinimal>(null);
   const { data, isLoading } = useMinimalIndividualsList(query);

   return {
      open,
      query,
      isLoading,
      inputRef,
      individuals: data,
      selectedIndividual,
      setOpen,
      setQuery,
      setSelectedIndividual,
   };
}
