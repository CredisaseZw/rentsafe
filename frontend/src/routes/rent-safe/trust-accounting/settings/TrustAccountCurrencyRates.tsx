import ButtonSpinner from "@/components/general/ButtonSpinner"
import Header from "@/components/general/Header"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import useTrustAccountCurrencyRates from "@/hooks/apiHooks/useTrustAccountCurrencyRates"
import { validateAmounts } from "@/lib/utils"
import { Send } from "lucide-react"

function TrustAccountCurrencyRates() {
    const {
        loading,
        currencyLoading,
        currencies,
        currencySetting,
        onHandleChange,
        handleSubmit,
    } = useTrustAccountCurrencyRates()
  return (
    <div>
        <Header title="Trust Account Exchange Rates" variant="success"/>
          <div className="main-sm-card">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-row w-full gap-4">
                <div className="w-1/7 flex">
                    <span className="self-center text-sm">Base Currency</span>
                </div>
                <Select
                    name="baseCurrency"
                    key={currencySetting.base_currency_id}
                    value={String(currencySetting.base_currency_id)}
                    onValueChange={(v)=> onHandleChange("base_currency_id", v)}
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
            <div className="flex flex-row w-full gap-4">
                <div className="w-1/7 flex">
                <span className="self-center text-sm">Currency to convert</span>
                </div>
                <div className="w-full flex flex-row justify-evenly gap-5">
                <div className="w-full">
                    <div className="form-group">
                        <Label className="text-sm text-gray-400 required">Currency</Label>
                    </div>
                    <Select 
                        name="current" 
                        key={currencySetting.target_currency_id}
                        value={currencySetting.target_currency_id}
                        required
                        onValueChange={(value)=>onHandleChange("target_currency_id", value)}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                        {
                            currencies.map((c)=>
                            <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>)
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
                <div className="w-full">
                    <div className="form-group">
                        <Label className="text-sm required text-gray-400">Rate</Label>
                    </div>
                    <Input
                        type= "number"
                        step={0.01}
                        value={currencySetting.rate}
                        onChange={(e)=>onHandleChange("rate", e.target.value)}
                        onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                        onKeyDown={validateAmounts}
                        required
                        name = "rate"
                        className="w-full"
                    /> 
                </div>
                <div className="w-full">
                    <div className="form-group">
                        <Label className="text-sm text-gray-400">Date</Label>
                    </div>
                    <Input
                        defaultValue={currencySetting.base_date}
                        readOnly
                        name = "date"
                        className="w-full"
                    /> 
                </div>
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <Button disabled = {loading} type={"submit"}>
                {
                    loading ?
                    <ButtonSpinner />:
                    <Send size={15}/>
                }
                Submit
                </Button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default TrustAccountCurrencyRates