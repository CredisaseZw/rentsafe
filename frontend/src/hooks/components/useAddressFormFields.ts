import React from "react";
import useCountries from "../apiHooks/useCountries";
import useProvinces from "../apiHooks/useProvinces";
import type { AddressLocation } from "@/interfaces";

export default function useAddressFormFields() {
   const { countries, isLoading: countriesLoading } = useCountries();
   const { provinces, isLoading: provincesLoading } = useProvinces();

   const [location, dispatch] = React.useReducer(locationReducer, {
      countryId: undefined as string | undefined,
      provinceId: undefined as string | undefined,
      cityId: undefined as string | undefined,
      suburbId: undefined as string | undefined,
      countryName: undefined as string | undefined,
      provinceName: undefined as string | undefined,
      cityName: undefined as string | undefined,
      suburbName: undefined as string | undefined,
   });

   function locationReducer(prevLocation: AddressLocation, action: Action): AddressLocation {
      switch (action.type) {
         case "country-changed":
            return { ...prevLocation, countryId: action.value };
         case "province-changed":
            return { ...prevLocation, provinceId: action.value };
         case "city-changed":
            return { ...prevLocation, cityId: action.value };
         case "suburb-changed":
            return { ...prevLocation, suburbId: action.value };
         default:
            return prevLocation;
      }
   }

   const cities = [
      { id: 1, name: "Harare" },
      { id: 2, name: "Bulawayo" },
      { id: 3, name: "Chitungwiza" },
   ];

   const suburbs = [
      { id: 1, name: "Avondale" },
      { id: 2, name: "Borrowdale" },
      { id: 3, name: "Greendale" },
   ];

   return { location, countries, provinces, cities, suburbs, countriesLoading, provincesLoading, dispatch };
}

type Action = {
   type: "country-changed" | "province-changed" | "city-changed" | "suburb-changed" | "country-changed";
   value: string;
};
