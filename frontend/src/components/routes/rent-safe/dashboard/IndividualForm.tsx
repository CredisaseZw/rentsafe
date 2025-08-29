import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useIndividualForm from "@/hooks/components/useIndividualForm";
import MultiAddressInput from "@/components/general/MultiAddressInput";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function diviIndividualForm() {
   const { showForm, isPending, handleSubmit, setShowForm } = useIndividualForm();

   return (
      <Dialog
         modal
         open={showForm}
         onOpenChange={isPending ? () => toast("Processing form, please wait") : setShowForm}
      >
         <DialogTrigger asChild>
            <Button>
               Add New Individual <Plus />
            </Button>
         </DialogTrigger>

         <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[900px] sm:max-w-[default]`}>
            <DialogTitle>Add New Individual</DialogTitle>

            <form onSubmit={isPending ? undefined : handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="lastName">
                        Last Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="lastName" name="lastName" required className="border-color bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="firstName">
                        First Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="firstName" name="firstName" required className="border-color bg-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="identificationType">
                        Identification Type <span className="text-PRIMARY">*</span>
                     </Label>
                     <Select name="identificationType" required>
                        <SelectTrigger id="identificationType" className="border-color w-full bg-white">
                           <SelectValue placeholder="Identification type" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="national_id">National ID (ZW only)</SelectItem>
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
                        className="border-color bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="gender">
                        Gender <span className="text-PRIMARY">*</span>
                     </Label>
                     <Select name="gender" required>
                        <SelectTrigger id="gender" className="border-color w-full bg-white">
                           <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900">
                           <SelectItem value="male">Male</SelectItem>
                           <SelectItem value="female">Female</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="dateOfBirth">
                        Date Of Birth <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        required
                        type="date"
                        className="border-color bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="maritalStatus">
                        Marital Status <span className="text-PRIMARY">*</span>
                     </Label>
                     <Select name="maritalStatus" required>
                        <SelectTrigger id="maritalStatus" className="border-color w-full bg-white">
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
                     <Label className="px-2 font-normal" htmlFor="mobilePhone">
                        Mobile Phone <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="mobilePhone"
                        name="mobilePhone"
                        required
                        placeholder="e.g. +263 712 345678"
                        className="border-color bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="email">
                        Email Address
                     </Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. info@company.com"
                        className="border-color bg-white"
                     />
                  </div>

                  <div className="col-span-3 pt-5">
                     <MultiAddressInput />
                  </div>

                  <div className="col-span-3 pt-5">
                     <details>
                        <summary className="bg-SECONDARY/90 hover:bg-SECONDARY w-fit cursor-pointer rounded-md p-2 text-white transition-all">
                           Toggle Employment Details
                        </summary>

                        <div className="mt-5 grid grid-cols-3 items-center gap-5">
                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="employerName">
                                 Employer Name
                              </Label>
                              <Input
                                 id="employerName"
                                 name="employerName"
                                 placeholder="e.g. ABC Corp"
                                 className="border-color bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="jobTitle">
                                 Job Title
                              </Label>
                              <Input
                                 id="jobTitle"
                                 name="jobTitle"
                                 placeholder="e.g. Software Engineer"
                                 className="border-color bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="startDate">
                                 Start Date
                              </Label>
                              <Input
                                 id="startDate"
                                 name="startDate"
                                 type="date"
                                 max={new Date().toISOString().split("T")[0]}
                                 className="border-color bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="endDate">
                                 End Date
                              </Label>
                              <Input
                                 id="endDate"
                                 name="endDate"
                                 type="date"
                                 className="border-color bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="employerEmail">
                                 Email Address
                              </Label>
                              <Input
                                 id="employerEmail"
                                 name="employerEmail"
                                 type="email"
                                 className="border-color bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="monthlyIncome">
                                 Monthly Income
                              </Label>
                              <Input
                                 id="monthlyIncome"
                                 name="monthlyIncome"
                                 type="number"
                                 className="border-color bg-white"
                              />
                           </div>
                        </div>
                     </details>
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button disabled={isPending} type="submit">
                     {isPending ? (
                        <>
                           <Loader2 className="animate-spin" /> Adding Individual...
                        </>
                     ) : (
                        "Add Individual"
                     )}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
