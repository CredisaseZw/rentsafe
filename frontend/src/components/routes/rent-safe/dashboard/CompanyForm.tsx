import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/constants";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressFormFields from "@/components/general/AddressFormFields";
import useCompanyForm from "@/hooks/components/useCompanyForm";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function CompanyForm() {
   const { isPending, handleSubmit } = useCompanyForm();

   return (
      <Dialog modal {...(isPending ? { onOpenChange: () => toast("Processing form, please wait") } : undefined)}>
         <DialogTrigger asChild>
            <Button size="sm">
               Add New Company <Plus />
            </Button>
         </DialogTrigger>

         <DialogContent className={`max-w-[900px] sm:max-w-[default]`}>
            <DialogTitle>Add New Company</DialogTitle>

            <form onSubmit={isPending ? undefined : handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <>
                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="registration_name">
                           Registered Name <span className="text-PRIMARY">*</span>
                        </Label>
                        <Input
                           id="registration_name"
                           name="registration_name"
                           required
                           className="border-foreground/40 bg-white"
                           placeholder="e.g. ABC Holdings Ltd"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="trading_name">
                           Trading Name
                        </Label>
                        <Input
                           id="trading_name"
                           name="trading_name"
                           className="border-foreground/40 bg-white"
                           placeholder="e.g. ABC Rentals"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="registration_number">
                           Registration Number <span className="text-PRIMARY">*</span>
                        </Label>
                        <Input
                           id="registration_number"
                           name="registration_number"
                           required
                           className="border-foreground/40 bg-white"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="registration_date">
                           Registration Date
                        </Label>
                        <Input
                           id="registration_date"
                           name="registration_date"
                           type="date"
                           className="border-foreground/40 bg-white"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="email">
                           Email Address <span className="text-PRIMARY">*</span>
                        </Label>
                        <Input
                           id="email"
                           name="email"
                           required
                           type="email"
                           placeholder="e.g. info@company.com"
                           className="border-foreground/40 bg-white"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="trading_status">
                           Trading Status
                        </Label>
                        <Input
                           id="trading_status"
                           name="trading_status"
                           className="border-foreground/40 bg-white"
                           placeholder="e.g. Active"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="mobile_phone">
                           Mobile Number
                        </Label>
                        <Input
                           id="mobile_phone"
                           name="mobile_phone"
                           placeholder="e.g. +263 712 345678"
                           className="border-foreground/40 bg-white"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="landline_phone">
                           Landline Number
                        </Label>
                        <Input
                           id="landline_phone"
                           name="landline_phone"
                           placeholder="e.g. 020 1234567"
                           className="border-foreground/40 bg-white"
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="tin_number">
                           TIN Number
                        </Label>
                        <Input id="tin_number" name="tin_number" className="border-foreground/40 bg-white" />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="vat_number">
                           VAT Number
                        </Label>
                        <Input id="vat_number" name="vat_number" className="border-foreground/40 bg-white" />
                     </div>

                     <div className="flex flex-col gap-2">
                        <Label className="px-2 font-normal" htmlFor="industry">
                           Industry
                        </Label>
                        <Select name="industry">
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
                  </>

                  <div className="col-span-3 pt-5">
                     <AddressFormFields />
                  </div>

                  <div className="col-span-3 pt-5">
                     <details>
                        <summary>
                           <span className="font-semibold">Toggle Extra Details</span>
                        </summary>

                        <div className="mt-5 grid grid-cols-3 items-center gap-5">
                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="number_of_employees">
                                 Number of Employees
                              </Label>
                              <Input
                                 type="number"
                                 id="number_of_employees"
                                 name="number_of_employees"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="legal_status">
                                 Legal Status
                              </Label>
                              <Input
                                 id="legal_status"
                                 name="legal_status"
                                 className="border-foreground/40 bg-white"
                                 placeholder="e.g. Private Limited"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="date_of_incorporation">
                                 Date of Incorporation
                              </Label>
                              <Input
                                 id="date_of_incorporation"
                                 name="date_of_incorporation"
                                 type="date"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="risk_class">
                                 Risk Class
                              </Label>
                              <Input
                                 id="risk_class"
                                 name="risk_class"
                                 className="border-foreground/40 bg-white"
                                 placeholder="e.g. Low"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="operations">
                                 Operations
                              </Label>
                              <Input
                                 id="operations"
                                 name="operations"
                                 className="border-foreground/40 bg-white"
                                 placeholder="e.g. Manufacturing, Distribution"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="trend">
                                 Trend
                              </Label>
                              <Input
                                 id="trend"
                                 name="trend"
                                 className="border-foreground/40 bg-white"
                                 placeholder="e.g. Growing"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="account_number">
                                 Account Number
                              </Label>
                              <Input
                                 id="account_number"
                                 name="account_number"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="twitter">
                                 Twitter
                              </Label>
                              <Input type="url" id="twitter" name="twitter" className="border-foreground/40 bg-white" />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="facebook">
                                 Facebook
                              </Label>
                              <Input
                                 type="url"
                                 id="facebook"
                                 name="facebook"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="instagram">
                                 Instagram
                              </Label>
                              <Input
                                 type="url"
                                 id="instagram"
                                 name="instagram"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="linkedin">
                                 LinkedIn
                              </Label>
                              <Input
                                 type="url"
                                 id="linkedin"
                                 name="linkedin"
                                 className="border-foreground/40 bg-white"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <Label className="px-2 font-normal" htmlFor="notes">
                                 Notes
                              </Label>
                              <Input
                                 id="notes"
                                 name="notes"
                                 className="border-foreground/40 bg-white"
                                 placeholder="Important remarks"
                              />
                           </div>

                           <div className="flex items-center justify-center gap-2">
                              <Checkbox
                                 id="is_under_judicial"
                                 name="is_under_judicial"
                                 value="YES"
                                 className="border-foreground/40 bg-white"
                              />
                              <Label className="px-2 font-normal" htmlFor="is_under_judicial">
                                 Is Under Judicial
                              </Label>
                           </div>

                           <div className="flex items-center justify-center gap-2">
                              <Checkbox
                                 id="is_suspended"
                                 name="is_suspended"
                                 value="true"
                                 className="border-foreground/40 bg-white"
                              />
                              <Label className="px-2 font-normal" htmlFor="is_suspended">
                                 Is Suspended
                              </Label>
                           </div>
                        </div>
                     </details>
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button disabled={isPending} type="submit">
                     {isPending ? (
                        <>
                           <Loader2 className="animate-spin" /> Adding Company...
                        </>
                     ) : (
                        "Add Company"
                     )}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
