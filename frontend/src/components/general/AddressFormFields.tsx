import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { ALL_ADDRESS_TYPES } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAddressFormFields from "@/hooks/components/useAddressFormFields";
import AutoCompleteSuburb from "./AutoCompleteSuburb";
import ColumnsContainer from "./ColumnsContainer";
import type { Address } from "@/interfaces";

interface props{
   address: Address | undefined,
   number : number
}

export default function AddressFormFields({ number, address }: props) {
   const {
      suburb,
      searchValue,
      setSearchValue,
      onSelectSuburb
   } = useAddressFormFields(address);

   return (
      <ColumnsContainer  numberOfCols={3} gapClass="gap-5"> 
         <div className="flex flex-col gap-2">
            <Input hidden value={suburb?.id} required name={"suburb_id" + number}/>
            <AutoCompleteSuburb
               searchItem= {searchValue}
               setSearchItem={setSearchValue}
               onSelectValue={onSelectSuburb}
            />
         </div>
         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal">
               Province
            </Label>
           <Input
               disabled
               value={suburb?.province}
               name = "province"
           />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal required" >
               City/Town
            </Label>
              <Input
               disabled
               required
               value={suburb?.city}
               name = "city"
           />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" >
               Country
            </Label>
              <Input
               disabled
               value={suburb?.country}
               name = "country"
           />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="required px-2 font-normal">
               Street Address
            </Label>
            <Input
               required
               id={"street_address" + number}
               name={"street_address" + number}
               placeholder="e.g. 22 Cnr Sam Nujoma Str"
               className="border-color bg-white"
               defaultValue={address?.street_address ?? ""}

            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"postal_code" + number}>
               Postal Code
            </Label>
            <Input
               defaultValue={address?.postal_code ?? ""}
               id={"postal_code" + number}
               name={"postal_code" + number}
               className="border-color bg-white"
            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"address_type" + number}>
               Address Type
            </Label>
            <Select 
               name={"address_type" + number} 
               defaultValue={address?.address_type?.toString() ?? ALL_ADDRESS_TYPES[0]}>
               <SelectTrigger id={"address_type" + number} className="border-color w-full bg-white">
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

         <div className="flex flex-row self-center pt-4 gap-2">
            <Checkbox
               id={"is_primary_address" + number}
               name={"is_primary_address" + number}
               value="true"
               className="border-color bg-white"
               checked={number === 1}
               disabled={number !== 1}
            />
            <Label className="px-2 font-normal" htmlFor={"is_primary_address" + number}>
               Is Primary
            </Label>
         </div>
    </ColumnsContainer>

   );
}
