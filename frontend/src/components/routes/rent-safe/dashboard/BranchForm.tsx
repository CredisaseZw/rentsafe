import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import MultiAddressInput from "@/components/general/MultiAddressInput";
import Button from "@/components/general/Button";
import useBranchForm from "@/hooks/components/useBranchForm";
import MultiContactInput from "@/components/general/MultiContactInput";
import AutoCompleteCompanySearchInput from "@/components/general/AutoCompleteCompanySearchInput";

export default function BranchForm() {
   const { showForm, isPending, handleSubmit, setShowForm } = useBranchForm();
   return (
      <Dialog
         modal
         open={showForm}
         onOpenChange={isPending ? () => toast("Processing form, please wait") : setShowForm}
      >
         <DialogTrigger asChild>
            <Button asChild variant={"outline"}>
               New Branch <Plus size={16} />
            </Button>
         </DialogTrigger>

         <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[900px] sm:max-w-[default]`}>
            <DialogTitle>Create A New Branch </DialogTitle>

            <form onSubmit={isPending ? undefined : handleSubmit} className="max-h-[80vh] overflow-auto p-8 text-sm">
               <div className="grid grid-cols-3 items-center gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_name">
                        Company Name
                     </Label>
                     <AutoCompleteCompanySearchInput elementName="companyId" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_name">
                        Branch Name
                     </Label>
                     <Input id="branch_name" name="branch_name" required className="border-color bg-white" />
                  </div>

                  <div className="col-span-3 pt-5">
                     <MultiContactInput />
                  </div>

                  <div className="col-span-3 pt-5">
                     <MultiAddressInput />
                  </div>
               </div>

               <div className="mt-10 text-right">
                  <Button disabled={isPending} asChild type="submit">
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

   return <></>;
}
