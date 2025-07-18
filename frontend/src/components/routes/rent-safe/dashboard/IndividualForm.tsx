import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressFormFields from "@/components/general/AddressFormFields";

export default function IndividualForm() {
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      console.log("Submitted data:", data);
   }

   return (
      <Dialog modal>
         <DialogTrigger asChild>
            <Button size="sm">
               Add New Individual <Plus />
            </Button>
         </DialogTrigger>

         <DialogContent className="max-w-[900px] sm:max-w-[default]">
            <DialogTitle>Add New Individual</DialogTitle>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="surname">
                        Surname <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="surname" name="surname" required className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="firstName">
                        First Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="firstName" name="firstName" required className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="identificationType">
                        Identification Type <span className="text-PRIMARY">*</span>
                     </Label>
                     <Select name="identificationType" required>
                        <SelectTrigger id="identificationType" className="border-foreground/40 w-full bg-white">
                           <SelectValue placeholder="Identification type" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="national-id">National ID</SelectItem>
                           <SelectItem value="passport">Passport</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="identificationNumber">
                        Identification Number <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="identificationNumber"
                        name="identificationNumber"
                        required
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="gender">
                        Gender
                     </Label>
                     <Select name="gender">
                        <SelectTrigger id="gender" className="border-foreground/40 w-full bg-white">
                           <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="male">Male</SelectItem>
                           <SelectItem value="female">Female</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="dateOfBirth">
                        Date Of Birth
                     </Label>
                     <Input id="dateOfBirth" name="dateOfBirth" type="date" className="border-foreground/40 bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="maritalStatus">
                        Marital Status
                     </Label>
                     <Select name="maritalStatus">
                        <SelectTrigger id="maritalStatus" className="border-foreground/40 w-full bg-white">
                           <SelectValue placeholder="Marital Status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="single">Single</SelectItem>
                           <SelectItem value="married">Married</SelectItem>
                           <SelectItem value="divorced">Divorced</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="address">
                        Address <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="address"
                        name="address"
                        required
                        placeholder="e.g. 123 Main St, Harare"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="mobileNumber">
                        Mobile Number <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        required
                        placeholder="e.g. +263 712 345678"
                        className="border-foreground/40 bg-white"
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="landline">
                        Landline
                     </Label>
                     <Input
                        id="landline"
                        name="landline"
                        placeholder="e.g. 020 1234567"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="emailAddress">
                        Email Address
                     </Label>
                     <Input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        placeholder="e.g. info@company.com"
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="col-span-3">
                     <fieldset className="border-foreground/40 mt-4 grid grid-cols-3 items-center gap-5 border-t pt-8">
                        <legend className="mx-5 px-2 font-semibold">Employment Details</legend>

                        <div className="flex flex-col gap-2">
                           <Label className="px-2 font-normal" htmlFor="currentEmployer">
                              Current Employer
                           </Label>
                           <Input
                              id="currentEmployer"
                              name="currentEmployer"
                              placeholder="e.g. ABC Corp"
                              className="border-foreground/40 bg-white"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label className="px-2 font-normal" htmlFor="currentJobTitle">
                              Current Job Title
                           </Label>
                           <Input
                              id="currentJobTitle"
                              name="currentJobTitle"
                              placeholder="e.g. Software Engineer"
                              className="border-foreground/40 bg-white"
                           />
                        </div>

                        <div className="flex flex-col gap-2">
                           <Label className="px-2 font-normal" htmlFor="dateOfEmployment">
                              Date of Employment
                           </Label>
                           <Input
                              id="dateOfEmployment"
                              name="dateOfEmployment"
                              type="date"
                              className="border-foreground/40 bg-white"
                           />
                        </div>
                     </fieldset>
                  </div>

                  <div className="col-span-3">
                     <AddressFormFields />
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button type="submit">Add Individual</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
