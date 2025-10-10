import Button from "@/components/general/Button"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import Header from "@/components/general/Header"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSetCurrencySettings } from "@/hooks/apiHooks/useCurrencySettings"
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies"
import useCurrencySettings from "@/hooks/components/useCurrencySettings"
import { getCurrentDate, validateAmounts } from "@/lib/utils"
import { isAxiosError } from "axios"
import { Send } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

function SettingsCurrency() {
  const {
    loading,
    currencies,
    defaultCurrency,
    setDefaultCurrency,
    setCurrencies,
    handleSubmit
  } = useCurrencySettings()
  const setCurrencySettings = useSetCurrencySettings()
  const {currencyData, currencyLoading, currencyError} = useGetCurrencies()

  useEffect(()=>{
    if(isAxiosError(currencyError)){
      const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
      toast.error("Error fetching currencies", {description : m})
    } 
    if(currencyData){
      const id = currencyData.find((c)=> c.currency_code === "ZWL")?.id
      setCurrencies(currencyData)
      setDefaultCurrency(String(id))
    }
  },[currencyData, currencyError])

  return (
    <div>
      <Header title="Currency Settings"/>
      <div className="main-sm-card">
        <form onSubmit={(e)=>handleSubmit(setCurrencySettings,e)} className="w-full flex flex-col gap-5">
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/7 flex">
              <span className="self-center text-sm">Base Currency</span>
            </div>
            <Select name="baseCurrency" key={defaultCurrency} defaultValue={defaultCurrency}>
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
                  <Select name="current" required>
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
                    defaultValue={getCurrentDate()}
                    readOnly
                    name = "date"
                    className="w-full"
                  /> 
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <Button asChild disabled = {loading} type={"submit"}>
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

export default SettingsCurrency