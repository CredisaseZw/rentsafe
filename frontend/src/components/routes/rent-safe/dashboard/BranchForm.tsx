import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import MultiAddressInput from "@/components/general/MultiAddressInput";
import { Button } from "@/components/ui/button";
import useBranchForm from "@/hooks/components/useBranchForm";
import useCompany from "@/hooks/apiHooks/useCompany";
import MultiContactInput from "@/components/general/MultiContactInput";

export default function BranchForm({ companyId }: { companyId: number }) {
   const { showForm, isPending, handleSubmit, setShowForm } = useBranchForm(companyId);
   const { company } = useCompany(companyId);

   return (
      <Dialog
         modal
         open={showForm}
         onOpenChange={isPending ? () => toast("Processing form, please wait") : setShowForm}
      >
         <DialogTrigger asChild>
            <Button variant="outline" size="xs">
               New Branch <Plus size={16} />
            </Button>
         </DialogTrigger>

         <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[900px] sm:max-w-[default]`}>
            <DialogTitle>Create A New Branch </DialogTitle>

            <form onSubmit={isPending ? undefined : handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="company_name">
                        Company
                        <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input
                        id="company_name"
                        name="company_name"
                        value={company?.registration_name + " - " + company?.registration_number}
                        readOnly
                        disabled
                        className="border-foreground/40 bg-white"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="px-2 font-normal" htmlFor="branch_name">
                        Branch Name <span className="text-PRIMARY">*</span>
                     </Label>
                     <Input id="branch_name" name="branch_name" required className="border-foreground/40 bg-white" />
                  </div>

                  <div className="col-span-3 pt-5">
                     <MultiContactInput />
                  </div>

                  <div className="col-span-3 pt-5">
                     <MultiAddressInput />
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button disabled={isPending} type="submit">
                     {isPending ? (
                        <>
                           <Loader2 className="animate-spin" /> Adding Branch...
                        </>
                     ) : (
                        "Add Branch"
                     )}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
