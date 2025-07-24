import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { ALL_ADDRESS_TYPES } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAddressFormFields from "@/hooks/components/useAddressFormFields";

export default function AddressFormFields({ number }: { number: number }) {
   const {
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
   } = useAddressFormFields();

   return (
      <div className="mt-5 grid grid-cols-3 items-center gap-5">
         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"country_id" + number}>
               Country
            </Label>
            <Select
               name={"country_id" + number}
               disabled={countriesLoading || countries?.length === 0}
               value={location.countryId}
               onValueChange={(value) => dispatch({ type: "country-changed", value: value })}
            >
               <SelectTrigger id={"country_id" + number} className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder={countriesLoading ? "Loading..." : "Select country"} />
               </SelectTrigger>
               <SelectContent>
                  {countries?.map((country) => (
                     <SelectItem key={country.id} value={country.id.toString()} className="line-clamp-1">
                        {country.name} ({country.code})
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"province_id" + number}>
               Province
            </Label>
            <Select
               name={"province_id" + number}
               disabled={provincesLoading || provinces?.length === 0}
               value={location.provinceId}
               onValueChange={(value) => dispatch({ type: "province-changed", value: value })}
            >
               <SelectTrigger id={"province_id" + number} className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder={provincesLoading ? "Loading..." : "Select province"} />
               </SelectTrigger>
               <SelectContent>
                  {provinces?.map((province) => (
                     <SelectItem key={province.id} value={province.id.toString()} className="line-clamp-1">
                        {province.name} ({province.code})
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"city_id" + number}>
               City <span className="text-PRIMARY">*</span>
            </Label>
            <Select
               required
               name={"city_id" + number}
               disabled={citiesLoading || cities?.length === 0}
               value={location.cityId}
               onValueChange={(value) => dispatch({ type: "city-changed", value: value })}
            >
               <SelectTrigger id={"city_id" + number} className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder={citiesLoading ? "Loading..." : "Select city"} />
               </SelectTrigger>
               <SelectContent>
                  {cities?.map((city) => (
                     <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"suburb_id" + number}>
               Suburb
            </Label>
            <Select
               name={"suburb_id" + number}
               disabled={suburbsLoading || suburbs?.length === 0}
               value={location.suburbId}
               onValueChange={(value) => dispatch({ type: "suburb-changed", value: value })}
            >
               <SelectTrigger id={"suburb_id" + number} className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder={suburbsLoading ? "Loading..." : "Select suburb"} />
               </SelectTrigger>
               <SelectContent>
                  {suburbs?.map((suburb) => (
                     <SelectItem key={suburb.id} value={suburb.id.toString()}>
                        {suburb.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"street_address" + number}>
               Street Address
            </Label>
            <Input
               id={"street_address" + number}
               name={"street_address" + number}
               placeholder="e.g. 22 Cnr Sam Nujoma Str"
               className="border-foreground/40 bg-white"
            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"postal_code" + number}>
               Postal Code
            </Label>
            <Input
               id={"postal_code" + number}
               name={"postal_code" + number}
               className="border-foreground/40 bg-white"
            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"address_type" + number}>
               Address Type
            </Label>
            <Select name={"address_type" + number} defaultValue={ALL_ADDRESS_TYPES[0]}>
               <SelectTrigger id={"address_type" + number} className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder="Select address type" />
               </SelectTrigger>
               <SelectContent>
                  {ALL_ADDRESS_TYPES.map((type) => (
                     <SelectItem key={type} value={type}>
                        {type}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex items-center justify-center gap-2">
            <Checkbox
               id={"is_primary" + number}
               name={"is_primary" + number}
               value="true"
               className="border-foreground/40 bg-white"
               checked={number === 1}
               disabled={number !== 1}
            />
            <Label className="px-2 font-normal" htmlFor={"is_primary" + number}>
               Is Primary
            </Label>
         </div>
      </div>
   );
}
