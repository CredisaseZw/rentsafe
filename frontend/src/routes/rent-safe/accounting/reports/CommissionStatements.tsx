import Button from "@/components/general/Button"
import Header from "@/components/general/Header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES, MONTHS, YEARS } from "@/constants"
import useCommissionStatements from "@/hooks/components/useCommissionStatements"

function CommissionStatements() {
  const {
    selectedPeriod,
    setSelectedPeriod
  }= useCommissionStatements()
  return (
    <div>
      <Header title="Commission Statements" />
      <div className="main-sm-card">
        <form className="w-full h-full flex flex-col gap-5">
            <div className="flex flex-row w-full gap-4">
              <div className="w-1/7 flex">
                <span className="self-center text-sm">Type:</span>
              </div>
              <Select defaultValue="individual">
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
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/7 flex">
              <span className="self-center text-sm">Period Selection:</span>
            </div>
            <Select value={selectedPeriod} onValueChange={(v : "month" | "date")=> setSelectedPeriod(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/7 flex">
              <span className="self-center text-sm">Month Selection: </span>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <div className="form-group w-1/2">
                <Label className="text-sm text-gray-600 dark:text-white">Year</Label>
                <Select disabled= {selectedPeriod === "date"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      YEARS.map((y, idx)=>(
                        <SelectItem value={y.value} key={idx}>{y.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group w-1/2">
                <Label className="text-sm text-gray-600 dark:text-white">Month</Label>
                  <Select disabled= {selectedPeriod === "date"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      MONTHS.map((y, idx)=>(
                        <SelectItem value={y.value} key={idx}>{y.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full gap-4">
            <div className="w-1/7 flex">
              <span className="self-center text-sm">Date Selection: </span>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <div className="form-group w-1/2">
                <Label className="text-sm text-gray-600 dark:text-white">Start Date</Label>
                <Input name="startDate" type="date" disabled = {selectedPeriod === "month"}/>
              </div>
              <div className="form-group w-1/2">
                <Label className="text-sm text-gray-600 dark:text-white">End Date</Label>
                <Input name="endDate" type="date" disabled = {selectedPeriod === "month"}/>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end">
              <Button>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommissionStatements