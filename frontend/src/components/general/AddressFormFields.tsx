import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddressFormFields() {
   return (
      <fieldset className="border-foreground/40 mt-4 grid grid-cols-3 items-center gap-5 border-t pt-8">
         <legend className="mx-5 px-2 font-semibold">Address</legend>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="country">
               Country <span className="text-PRIMARY">*</span>
            </Label>
            <Select name="country" required>
               <SelectTrigger id="country" className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder="Select country" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Botswana">Botswana</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="province">
               Province <span className="text-PRIMARY">*</span>
            </Label>
            <Select name="province" required>
               <SelectTrigger id="province" className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder="Select province" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="Harare">Harare</SelectItem>
                  <SelectItem value="Bulawayo">Bulawayo</SelectItem>
                  <SelectItem value="Mashonaland East">Mashonaland East</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="city">
               City <span className="text-PRIMARY">*</span>
            </Label>
            <Select name="city" required>
               <SelectTrigger id="city" className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder="Select city" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="Harare">Harare</SelectItem>
                  <SelectItem value="Bulawayo">Bulawayo</SelectItem>
                  <SelectItem value="Chitungwiza">Chitungwiza</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="suburb">
               Suburb <span className="text-PRIMARY">*</span>
            </Label>
            <Select name="suburb" required>
               <SelectTrigger id="suburb" className="border-foreground/40 w-full bg-white">
                  <SelectValue placeholder="Select suburb" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="Avondale">Avondale</SelectItem>
                  <SelectItem value="Borrowdale">Borrowdale</SelectItem>
                  <SelectItem value="Greendale">Greendale</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="street">
               Street <span className="text-PRIMARY">*</span>
            </Label>
            <Input
               id="street"
               name="street"
               required
               placeholder="e.g. Sam Nujoma Street"
               className="border-foreground/40 bg-white"
            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="building">
               Building
            </Label>
            <Input
               id="building"
               name="building"
               placeholder="e.g. Joina City"
               className="border-foreground/40 bg-white"
            />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="unit">
               Unit
            </Label>
            <Input id="unit" name="unit" placeholder="e.g. Suite 12B" className="border-foreground/40 bg-white" />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor="areaCode">
               Area Code
            </Label>
            <Input id="areaCode" name="areaCode" placeholder="e.g. 00263" className="border-foreground/40 bg-white" />
         </div>
      </fieldset>
   );
}
