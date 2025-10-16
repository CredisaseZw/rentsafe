import Header from "@/components/general/Header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES } from "@/constants"

function CommissionStatements() {
  return (
    <div>
      <Header title="Commission Statements" />
      <div className="main-sm-card">
        <form className="w-full h-full">
            <div className="flex flex-row w-full gap-4">
              <div className="w-1/7 flex">
                <span className="self-center text-sm">Type:</span>
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    IN_LEASE_CLIENT_TYPES.map((c, idx)=>
                      <SelectItem value={c.value} key={idx} >{c.label}</SelectItem>
                    )
                  }
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommissionStatements