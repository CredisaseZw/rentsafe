import Header from "@/components/general/Header"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { useCurrency } from "@/contexts/CurrencyContext"

function CashbookReceipts() {
  const {currencies, currencyLoading, currency} = useCurrency()
  return (
    <div>
      <Header title="Receipts" />
      <div className="main-card">
        <div className="flex flex-row gap-5 justify-center items-center">
          <div className="flex flex-row gap-5">
            <span className="text-sm self-center">Cashbook: </span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select ..."></SelectValue>
              </SelectTrigger>
              <SelectContent>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-5">
            <span className="text-sm self-center">Cashbook: </span>
            <Select key={currency?.id}  name="currency" required defaultValue={String(currency?.id)}>
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
                
        </div>
        <div className="mt-5">
          
        </div>
      </div>
    </div>
  )
}

export default CashbookReceipts