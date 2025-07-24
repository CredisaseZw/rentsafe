import React from "react";
import useCountries from "../apiHooks/useCountries";
import useProvinces from "../apiHooks/useProvinces";
import type { AddressLocation } from "@/interfaces";
import useCities from "../apiHooks/useCities";
import useSuburbs from "../apiHooks/useSuburbs";

export default function useAddressFormFields() {
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

   const { countries, isLoading: countriesLoading } = useCountries();
   const { provinces, isLoading: provincesLoading } = useProvinces(location.countryId);
   const { cities, isLoading: citiesLoading } = useCities(location.provinceId);
   const { suburbs, isLoading: suburbsLoading } = useSuburbs(location.cityId);

   return {
      cities,
      suburbs,
      location,
      countries,
      provinces,
      citiesLoading,
      suburbsLoading,
      countriesLoading,
      provincesLoading,
      dispatch,
   };
}

type Action = {
   type: "country-changed" | "province-changed" | "city-changed" | "suburb-changed" | "country-changed";
   value: string;
};

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
