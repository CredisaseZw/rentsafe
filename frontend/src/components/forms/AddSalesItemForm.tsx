import useSalesItemsForm from "@/hooks/components/useSalesItemsForm"
import ColumnsContainer from "../general/ColumnsContainer"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingIndicator from "../general/LoadingIndicator"
import Button from "../general/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function AddSalesItemForm() {
    const {
        vatSettings,
        isLoading,
        currency,
        currencies,
        currencyLoading,
        salesCategories,
        categoriesLoading,
        categoriesPagination,
        handleLoadMoreCategories,
        handleSubmit
    } = useSalesItemsForm();

    return (
    <form className="flex flex-col gap-5" onSubmit={(e)=> handleSubmit(e)}>
        <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="mt-0">
            <div className="form-group">
                <Label className="required">Item Category</Label>
                <Select
                    required
                    name="itemCategory"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            salesCategories.length === 0 && categoriesLoading &&
                            <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                <LoadingIndicator />
                            </SelectItem>   
                        }
                        {
                            salesCategories.length !== 0 && 
                            salesCategories.map((s, idx:number)=>(
                                <SelectItem value={String(s.id)} key={idx}>{`${s.code} - ${s.name}`}</SelectItem>
                            ))
                        }
                        {
                            salesCategories.length === 0 && 
                            !!categoriesLoading && 
                            <SelectItem disabled value="empty">Nothing to Show</SelectItem>
                        }
                        {
                            salesCategories.length !== 0 && 
                            categoriesPagination?.next &&
                            <div className="flex justify-center p-2">
                                <Button variant="ghost" onClick={handleLoadMoreCategories}>
                                Load More
                                </Button>
                            </div>
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label className="required">Item name</Label>
                <Input name="itemName" required/>
            </div>
        </ColumnsContainer>
        <div className="form-group">
            <Label className="required">Unit Price</Label>
            <Input name="unitPrice" required/>
        </div>
        <div className="form-group">
            <Label>Currency</Label>
            <Select
                key={currency?.id}
                defaultValue={String(currency?.id)}
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
            <Label className="required">Unit Name</Label>
            <Input required name="unitName"/>
        </div>
        <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="mt-0">
            <div className="form-group">
                <Label className="required">Tax Configuration</Label>
                <Select
                    required
                    name="taxConfig"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            vatSettings.length === 0 && isLoading &&
                            <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                <LoadingIndicator />
                            </SelectItem>   
                        }
                        {
                            vatSettings.length !== 0 && 
                            vatSettings.map((s, idx:number)=>(
                                <Tooltip key={s.id}>
                                    <TooltipTrigger asChild>
                                        <SelectItem value={String(s.id)} key={idx}>{s.rate}</SelectItem>
                                    </TooltipTrigger>
                                 <TooltipContent>
                                    <p>{s.description}</p>
                                 </TooltipContent>
                              </Tooltip>
                            ))
                        }
                        {
                            salesCategories.length === 0 && 
                            !!categoriesLoading && 
                            <SelectItem disabled value="empty">Nothing to Show</SelectItem>
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="form-group">
                <Label className="required">Sales Account</Label>
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