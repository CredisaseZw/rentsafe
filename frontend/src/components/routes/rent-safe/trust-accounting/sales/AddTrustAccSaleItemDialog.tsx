import ColumnsContainer from "@/components/general/ColumnsContainer"
import EditIcon from "@/components/general/EditIcon"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogDescription,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAddTrustAccSaleItemDialog from "@/hooks/components/useAddTrustAccSaleItemDialog"
import type { TrustAccSalesItem } from "@/interfaces"
import { Plus, Send } from "lucide-react"
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import AutoCompleteTrustAccSalesCategories from "@/components/general/AutoCompleteTrustAccSalesCategories"

interface props {
    salesItem?: TrustAccSalesItem
}
function AddTrustAccSaleItemDialog({salesItem}:props) {
    const {
        currencyLoading,
        vatAccounts,
        currencies,
        formData,
        loading,
        open,
        setOpen,
        onSubmit,
        onHandleChange
    } = useAddTrustAccSaleItemDialog(salesItem);
  return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
             {
                salesItem?
                <div className="flex flex-row gap-3">
                    <EditIcon />
                    <span className="text-sm">Edit</span>
                </div>
                : <Button>
                    Add Sales Item    
                    <Plus/>
                </Button>
            }
        </DialogTrigger>
        <DialogContent className="md:max-w-[750px]">
            <DialogHeader>
                <DialogTitle>{salesItem ? "Update" : "Create new"} sales item.</DialogTitle>
                <DialogDescription>Fill in the details below and click submit to save.</DialogDescription>
            </DialogHeader>

            <form id ="trust-acc-sales-items" className="flex flex-col gap-5" onSubmit={onSubmit}>
                <ColumnsContainer numberOfCols={2}>
                    <div className="form-group">
                        <Label className="required">Name</Label>
                        <Input
                            required
                            name = "name"
                            defaultValue={salesItem?.name ?? ""}
                        />
                    </div>
                    <div className="form-group">
                        <Label className="required">Unit Name</Label>
                        <Input
                            required
                            name = "unit_name"
                            defaultValue={salesItem?.unit_name ?? ""}
                        />
                    </div>
                </ColumnsContainer>
                <AutoCompleteTrustAccSalesCategories
                    onSelectAccount={(item)=> onHandleChange("category_id", String(item.id))}
                    defaultValue={salesItem?.name ?? ""}
                />
                <ColumnsContainer numberOfCols={2} marginClass="">
                    <div className="form-group">
                        <Label className="required">Base Currency</Label>
                        <Select
                            name="baseCurrency"
                            key={formData.currency_id}
                            value={formData.currency_id}
                            onValueChange={(v)=> onHandleChange("currency_id", v)}
                            >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    currencies.map((c)=>
                                        <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>
                                    )
                                }
                                { 
                                    currencies.length === 0 &&
                                    currencyLoading &&
                                    <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                        <LoadingIndicator />
                                    </SelectItem>
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="form-group">
                        <Label className="required">Unit Price</Label>
                        <Input
                            required
                            type ="number"
                            step={"0.01"}
                            name = "unit_price"
                            placeholder="0.00"
                        />
                    </div>
                </ColumnsContainer>
                <div className="form-group">
                    <Label className="required">Tax Type</Label>
                    <Select
                        name="vat_id"
                        value={formData.vat_id}
                        key={formData.vat_id}
                        onValueChange={(val)=> onHandleChange("vat_id", val)}

                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder = "Select ..."/>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                vatAccounts.length === 0 &&
                                <SelectItem disabled value="empty" className="text-center">
                                    No vat accounts recorded
                                </SelectItem>
                            }
                            {
                                vatAccounts.map(item=>(
                                    <SelectItem value={String(item.id)} key={item.id}>{item.code} - {item.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </form>

            <DialogFooter>
                <DialogClose>
                    <Button variant={"ghost"}>
                        Close
                    </Button>
                </DialogClose>
                <Button form="trust-acc-sales-items" disabled = {loading}>
                    {
                        !loading
                        ? <Send/>
                        : <ButtonSpinner/>
                    }
                    Submit
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>    
)
}

export default AddTrustAccSaleItemDialog