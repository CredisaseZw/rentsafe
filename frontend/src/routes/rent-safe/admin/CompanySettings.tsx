import ColumnsContainer from "@/components/general/ColumnsContainer"
import Fieldset from "@/components/general/Fieldset"
import Header from "@/components/general/Header"
import MultiAddressInput from "@/components/general/MultiAddressInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from "@/components/ui/select"
import { MONTHS } from "@/constants"
import { Save, UploadCloud } from "lucide-react"

function CompanySettings() {
  return (
    <div>
        <Header title="Company Settings" />
        <div className="main-sm-card">
            <form className="w-full space-y-5">
                <ColumnsContainer numberOfCols={2} marginClass="" gapClass="gap-10">
                    <div className="space-y-5">  
                        <div className="form-group">
                            <Label>Company Registered Name</Label>
                            <Input
                                name="companyName"
                            />
                        </div>
                        <div className="form-group">
                            <Label>Company Trading Name (to be shown on documents)</Label>
                            <Input
                                name="companyTradingName"
                            />
                        </div>
                        <div>
                            <MultiAddressInput isMultiple = {false} />
                        </div>
                        <div className="form-group">
                            <Label>Telephone Number</Label>
                            <Input
                                name="telephoneNumber"
                            />
                        </div>
                        <div className="form-group">
                            <Label>Mobile Number</Label>
                            <Input
                                name="mobileNumber"
                            />
                        </div>
                        <div className="form-group">
                            <Label>Email Address</Label>
                            <Input
                                name="emailAddress"
                                type={"email"}
                            />
                        </div>
                        <div className="form-group">
                            <Label>Company Website</Label>
                            <Input
                                name="website"
                            />
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="form-group">
                            <Label>VAT Number</Label>
                            <Input
                                name="vatNumber"
                            />
                        </div>
                        <div className="form-group">
                            <Label>Tin Number</Label>
                            <Input
                                name="tinNumber"
                            />
                        </div>
                        <div className="form-group">
                            <Label>NSSA Number</Label>
                            <Input
                                name="nssaNumber"
                            />
                        </div>
                        <div className="form-group">
                            <Label>PRAZ Website</Label>
                            <Input
                                name="prazNumber"
                            />
                        </div>
                        <Fieldset legendTitle="Month End Date">
                            <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="">
                                <div className="form-group">
                                    <Label>Date</Label>
                                    <Input
                                        name="monthEndDate_Date"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label>Last day of the month</Label>
                                    <Input
                                        name="monthEndDate_lastDate"
                                    />
                                </div>
                            </ColumnsContainer>
                        </Fieldset>
                        <Fieldset legendTitle="Year End Date">
                            <ColumnsContainer numberOfCols={2} gapClass="gap-5" marginClass="">
                                <div className="form-group">
                                    <Label>Date</Label>
                                    <Input
                                        name="yearEndDate_Date"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label>Last day of the month</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder = "Select Month ..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                MONTHS.map((m, idx)=>
                                                <SelectItem key={idx} value={m.value}>{m.label}</SelectItem>
                                            )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </ColumnsContainer>
                        </Fieldset>
                        <div className="border-2 border-dashed p-5 rounded-2xl border-color h-[20vh] flex flex-col justify-center items-center">
                            <UploadCloud size={50} className="text-gray-300 dark:text-gray-400"/>
                            <span>Upload company logo</span>
                        </div>
                    </div>
                </ColumnsContainer>
                <div className="flex justify-end">
                    <Button>
                        <Save/>
                        Save
                    </Button>
                </div>
            </form> 
        </div>
    </div>
  )
}

export default CompanySettings