import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
Dialog,
DialogTrigger,
DialogContent,
DialogHeader,
DialogTitle,
DialogDescription,
DialogFooter,
} from "@/components/ui/dialog";
import useAddVATSetting from "@/hooks/components/useAddVATSetting";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus } from "lucide-react";
import useAddVATSettings from "@/hooks/apiHooks/useAddVATSettings";
import type { VATRow } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface props{
    vatSetting?: VATRow
}

export default function AddVATSettingDialog({vatSetting}: props) {
    const {
        open,
        loading,
        setOpen,
        handleSubmit
    } = useAddVATSetting(vatSetting)
    const addVATSetting = useAddVATSettings()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    vatSetting 
                    ? <Button variant={"ghost"} size={"xs"} className="gap-5 text-gray-700 dark:text-white"><Edit/> Edit VAT</Button>
                    :<Button>Add VAT <Plus/></Button>
                }
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>VAT Settings</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-white">
                        Configure value-added tax for this account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e)=>handleSubmit(e, addVATSetting)} className="space-y-8 mt-2">
                    <div className="form-group">
                        <Label className="text-gray-700 dark:text-white required">VAT Rate (%)</Label>
                        <Input
                            id="vat-rate"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min={0}
                            max={100}
                            name="rate"
                            required
                            defaultValue={vatSetting?.rate ?? ""}
                        />
                    </div>
                    <div className="form-group">
                        <Label htmlFor="vat-rate"
                            className="text-gray-700 dark:text-white required"
                        >Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Description"
                            className="placeholder:text-gray-500"
                            required
                            defaultValue={vatSetting?.description ?? ""}
                        ></Textarea>
                    </div>
                    {
                        vatSetting &&
                        <div>
                            <div className="flex flex-row gap-4">
                                <Checkbox
                                    className="self-center"
                                    defaultChecked = {vatSetting.vat_applicable}
                                    name="vatApplicable"
                                />
                                <Label className="text-sm">VAT Applicable</Label>
                            </div>
                        </div>
                    }
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}