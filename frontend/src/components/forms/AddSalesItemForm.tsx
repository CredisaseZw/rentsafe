import useSalesItemsForm from "@/hooks/components/useSalesItemsForm"
import ColumnsContainer from "../general/ColumnsContainer"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingIndicator from "../general/LoadingIndicator"
import Button from "../general/Button"


function AddSalesItemForm() {
    const {
        defaultCurrency,
        currencies,
        currencyLoading
    } = useSalesItemsForm();

    return (
    <form className="flex flex-col gap-5">
        <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="mt-0">
            <div className="form-group">
                <Label>Item Category</Label>
                <Select
                    required
                    name="itemCategory"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="e"></SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label>Item ID</Label>
                <Input name="itemID"/>
            </div>
        </ColumnsContainer>
        <div className="form-group">
            <Label>Item name</Label>
            <Input name="itemName"/>
        </div>
        <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="mt-0">
            <div className="form-group">
                <Label>Currency</Label>
                <Select
                    key={defaultCurrency}
                    defaultValue={defaultCurrency}
                    required
                    name="itemCurrency"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {   !currencyLoading ?
                            currencies.map((C, i)=>(
                                <SelectItem value={String(C.id)} key={i}>{`${C.currency_code} - ${C.currency_name}`}</SelectItem>
                            )) :
                            <SelectItem value="loading">
                                <LoadingIndicator />
                            </SelectItem>
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label>Unit Price</Label>
                <Input name="unitPrice"/>
            </div>
        </ColumnsContainer>
        <div className="form-group">
            <Label>Unit Name</Label>
            <Input name="unitName"/>
        </div>
        <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="mt-0">
            <div className="form-group">
                <Label>Tax Configuration</Label>
                <Select
                    required
                    name="taxConfig"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="e"></SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label>Sales Account</Label>
                <Select
                    required
                    name="salesAccount"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="e"></SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </ColumnsContainer>
        <div className="flex flex-row justify-end">
            <Button>Save</Button>
        </div>
    </form>
  )
}

export default AddSalesItemForm