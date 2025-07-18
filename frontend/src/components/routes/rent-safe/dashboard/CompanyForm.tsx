import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, MODAL_WIDTHS } from "@/constants";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressFormFields from "@/components/general/AddressFormFields";
import useCompanyForm from "@/hooks/components/useCompanyForm";

export default function CompanyForm() {
   const { handleSubmit } = useCompanyForm();

   return (
      <Dialog modal>
         <DialogTrigger asChild>
            <Button size="sm">
               Add New Company <Plus />
            </Button>
         </DialogTrigger>

         <DialogContent className={`max-w-[${MODAL_WIDTHS.md}] sm:max-w-[default]`}>
            <DialogTitle>Add New Company</DialogTitle>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="registeredName">
                        Registered Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="registeredName"
                        name="registeredName"
                        required
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="tradingName">
                        Trading Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="tradingName" name="tradingName" required className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="branch">
                        Branch
                     </Label>
                     <Input id="branch" name="branch" className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="registrationNumber">
                        Registration Number
                     </Label>
                     <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        placeholder="e.g. CPR/2023/123456"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="registrationDate">
                        Registration Date
                     </Label>
                     <Input
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        placeholder="Select date"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="vatNumber">
                        VAT Number
                     </Label>
                     <Input id="vatNumber" name="vatNumber" className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="tinNumber">
                        TIN Number
                     </Label>
                     <Input id="tinNumber" name="tinNumber" className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="telephoneNumber">
                        Telephone Number
                     </Label>
                     <Input
                        id="telephoneNumber"
                        name="telephoneNumber"
                        placeholder="e.g. 020 1234567"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="mobileNumber">
                        Mobile Number
                     </Label>
                     <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="e.g. +263 712 345678"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="emailAddress">
                        Email Address <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="emailAddress"
                        name="emailAddress"
                        required
                        type="email"
                        placeholder="e.g. info@company.com"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="website">
                        Website
                     </Label>
                     <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="e.g. https://company.com"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="industry">
                        Industry <span className="text-PRIMARY">*</span>
                     </Label>
                     <Select name="industry" required>
                        <SelectTrigger id="industry" className="border-foreground/40 w-full bg-white">
                           <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                           {INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                 {industry}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="col-span-3">
                     <AddressFormFields />
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button type="submit">Add Company</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
