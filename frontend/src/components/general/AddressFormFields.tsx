import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { ALL_ADDRESS_TYPES } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAddressFormFields from "@/hooks/components/useAddressFormFields";

export default function AddressFormFields() {
   const { location, countries, provinces, cities, suburbs, countriesLoading, provincesLoading, dispatch } =
      useAddressFormFields();

   return (
      <details>
         <summary>
            <span className="font-semibold">Toggle Addrress Details</span>
         </summary>

         <div className="mt-5 grid grid-cols-3 items-center gap-5">
            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="country_id">
                  Country
               </Label>
               <Select
                  name="country_id"
                  disabled={countriesLoading}
                  value={location.countryId}
                  onValueChange={(value) => dispatch({ type: "country-changed", value: value })}
               >
                  <SelectTrigger id="country_id" className="border-foreground/40 w-full bg-white">
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
               <Label className="px-2 font-normal" htmlFor="province_id">
                  Province
               </Label>
               <Select
                  name="province_id"
                  disabled={provincesLoading}
                  value={location.provinceId}
                  onValueChange={(value) => dispatch({ type: "province-changed", value: value })}
               >
                  <SelectTrigger id="province_id" className="border-foreground/40 w-full bg-white">
                     <SelectValue placeholder={provincesLoading ? "Loading..." : "Select province"} />
                  </SelectTrigger>
                  <SelectContent>
                     {provinces
                        ?.filter((province) => province.country === location.countryName)
                        .map((province) => (
                           <SelectItem key={province.id} value={province.id.toString()} className="line-clamp-1">
                              {province.name} ({province.code})
                           </SelectItem>
                        ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="city_id">
                  City <span className="text-PRIMARY">*</span>
               </Label>
               <Select name="city_id">
                  <SelectTrigger id="city_id" className="border-foreground/40 w-full bg-white">
                     <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                     {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                           {city.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="suburb_id">
                  Suburb
               </Label>
               <Select name="suburb_id">
                  <SelectTrigger id="suburb_id" className="border-foreground/40 w-full bg-white">
                     <SelectValue placeholder="Select suburb" />
                  </SelectTrigger>
                  <SelectContent>
                     {suburbs.map((suburb) => (
                        <SelectItem key={suburb.id} value={suburb.id.toString()}>
                           {suburb.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="street_address">
                  Street Address
               </Label>
               <Input
                  id="street_address"
                  name="street_address"
                  placeholder="e.g. 22 Cnr Sam Nujoma Str"
                  className="border-foreground/40 bg-white"
               />
            </div>

            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="postal_code">
                  Postal Code
               </Label>
               <Input id="postal_code" name="postal_code" className="border-foreground/40 bg-white" />
            </div>

            <div className="flex flex-col gap-2">
               <Label className="px-2 font-normal" htmlFor="address_type">
                  Address Type
               </Label>
               <Select name="address_type">
                  <SelectTrigger id="address_type" className="border-foreground/40 w-full bg-white">
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
               <Checkbox id="is_primary" name="is_primary" value="true" className="border-foreground/40 bg-white" />
               <Label className="px-2 font-normal" htmlFor="is_primary">
                  Is Primary
               </Label>
            </div>
         </div>
      </details>
   );
}
