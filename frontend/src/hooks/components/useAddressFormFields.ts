import React from "react";
import useCountries from "../apiHooks/useCountries";

export default function useAddressFormFields() {
   const [location, setLocation] = React.useState({
      country: undefined as string | undefined,
      province: undefined as string | undefined,
      city: undefined as string | undefined,
      suburb: undefined as string | undefined,
   });

   const { countries, isLoading: countriesLoading } = useCountries();

   const cities = [
      { id: 1, name: "Harare" },
      { id: 2, name: "Bulawayo" },
      { id: 3, name: "Chitungwiza" },
   ];

   const provinces = [
      { id: 1, name: "Harare" },
      { id: 2, name: "Bulawayo" },
      { id: 3, name: "Mashonaland East" },
   ];

   const suburbs = [
      { id: 1, name: "Avondale" },
      { id: 2, name: "Borrowdale" },
      { id: 3, name: "Greendale" },
   ];

   return { location, countries, provinces, cities, suburbs, countriesLoading, setLocation };
}
