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
import ColumnsContainer from "@/components/general/ColumnsContainer";


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
               <span className="text-red-600">
               Add company branch
               </span> <Plus size={16}  color="oklch(57.7% 0.245 27.325)"/>
            </Button>
         </DialogTrigger>

         <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[900px] sm:max-w-[default]`}>
            <DialogTitle>Create A New Branch </DialogTitle>

            <form onSubmit={isPending ? undefined : handleSubmit} className="max-h-[80vh] overflow-auto p-4 text-sm">
               <ColumnsContainer numberOfCols={3} gapClass="gap-5">
                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_name">
                        Company Name
                     </Label>
                     <AutoCompleteCompanySearchInput
                        closeDialogue={() =>{
                           setShowForm(false)
                        }}
                        elementName="companyId" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_name">
                        Branch Name
                     </Label>
                     <Input id="branch_name" name="branch_name" required className="border-color bg-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_email">
                        Branch Email
                     </Label>
                     <Input id="branch_email" type="email" name="branch_email" required className="border-color bg-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label className="required px-2 font-normal" htmlFor="branch_phone">
                        Branch Contact Number
                     </Label>
                     <Input id="branch_phone" name="branch_phone" required className="border-color bg-white" />
                  </div>
               </ColumnsContainer>

               <div className="pt-5">
                  <MultiContactInput />
               </div>

               <div className="pt-5">
                  <MultiAddressInput />
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
