import ButtonSpinner from "@/components/general/ButtonSpinner"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import EditIcon from "@/components/general/EditIcon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription,DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useTrustAccVATSettingsDialogue from "@/hooks/components/useTrustAccVATSettingsDialogue"
import type { VATRow } from "@/types"
import { Plus, Send } from "lucide-react"

interface props {
    vatSetting?:  VATRow
}

function AddTrustAccVATSettingDialogue({ vatSetting }:props) {
    const {
        setOpen,
        onSubmit,
        loading,
        open
    } = useTrustAccVATSettingsDialogue(vatSetting)
    return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
            {
                vatSetting ?
                <div className="flex flex-row gap-3">
                    <EditIcon />
                    <span className="text-sm">Edit</span>
                </div>
                :<Button>
                    <Plus/>
                    Add V.A.T Setting
                </Button>
            }
        </DialogTrigger>
        <DialogContent className="md:max-w-[750px]">
            <DialogHeader>
                <DialogTitle>{vatSetting ? "Update" : "Add "}V.A.T Setting</DialogTitle>
                <DialogDescription>Fill in the fields and save.</DialogDescription>
            </DialogHeader>
                <form 
                    onSubmit={(e)=> onSubmit(e)}
                    id="add-vat-settings"
                    className="flex flex-col gap-3"
                    >
                    <div className="form-group">
                        <Label className="required">Name</Label>
                        <Input
                            defaultValue={vatSetting?.name ?? ""}
                            name="vat_name"
                            required
                        />
                    </div>
                    <ColumnsContainer numberOfCols={2} gapClass="gap-3">
                        <div className="form-group">
                            <Label className="required">Code</Label>
                            <Input
                                defaultValue={vatSetting?.code ?? ""}
                                name="vat_code"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <Label className="required">Rate</Label>
                            <Input
                                type="number"
                                step={"0.01"}
                                defaultValue={vatSetting?.rate ?? ""}
                                name="vat_rate"
                                required
                            />
                        </div>
                    </ColumnsContainer>
                    <div className="form-group">
                        <Label className="required">Description</Label>
                        <Textarea
                            required
                            defaultValue={vatSetting?.description ?? ""}
                            name="description"
                        />
                    </div>
                </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button form="add-vat-settings" disabled = {loading}>
                    {
                        loading 
                        ? <ButtonSpinner/>
                        : <Send/>
                    }
                    Send
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddTrustAccVATSettingDialogue