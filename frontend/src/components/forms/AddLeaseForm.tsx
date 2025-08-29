import ColumnsContainer from "../general/ColumnsContainer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormSectionHeader from "../general/FormSectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableBase } from "../general/TableBase";
import { TableCell, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import Button from "@/components/general/Button";
import useAddIndividualLease from "@/hooks/components/useAddIndividualLease";
import AutoCompleteLandlord from "../general/AutoCompleteLandlord";
import Fieldset from "../general/Fieldset";
import AutoCompleteProperty from "../general/AutoCompleteProperty";
import { useEffect } from "react";
import getPropertyTypes from "@/hooks/apiHooks/useGetPropertyTypes";
import { toast } from "sonner";
import type { ApiError, Option } from "@/types";
import LoadingIndicator from "../general/LoadingIndicator";
import { Plus } from "lucide-react";
import MultipleTenantInput from "../general/MultipleTenantInput";

function AddLeaseForm() {
  const {
    formData,
    headers,
    searchItem,
    landlordIdentifier,
    propertyName,
    propertyTypes,
    statusOptions,
    leaseStatusOptions,
    currencyOptions,
    paymentFrequencyOptions,
    depositHolderOptions,
    onSelectProperty,
    setPropertyTypes,
    setPropertyName,
    setLandlordIdentifier,
    setSearchItem,
    setFormData,
    onSelectLandlord,
    handleUpdateForm,
  } = useAddIndividualLease();

  const {data, isLoading, error} = getPropertyTypes();
  useEffect(()=>{
    if(error){
      console.error(error.message)
      toast.error("Failed to fetch property types", { description: (error as ApiError)?.error || "Something went wrong" });
      return;
    }
    if (data) { setPropertyTypes(data.results ?? []); }
  }, [data, error])

  return (
    <form className="w-full">
      <div className="mt-5">
        <MultipleTenantInput/>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle = {"Unit Details"}>
          <ColumnsContainer gapClass="gap-6" marginClass="mt-0" numberOfCols={3}>
            <div>
              <AutoCompleteProperty
                searchItem= {propertyName}
                setSearchItem={setPropertyName}
                onSelectValue={onSelectProperty}
              />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber" >Unit Number </Label>
              <Input id="unitNumber" required name="unitNumber"/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Number of Rooms </Label>
              <Input id="" name="unitNumber" required/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Unit type</Label>
              <Select
                  required
                  name="unit_type">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      propertyTypes.length &&
                      propertyTypes.map((property_type)=>
                        <SelectItem value={property_type.id && property_type.id.toString() || ""} key={property_type.id}>{property_type.name}</SelectItem>
                      )
                    }
                    { 
                      !propertyTypes &&
                      isLoading &&
                      <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                          <LoadingIndicator />
                        </SelectItem>
                    }
                  </SelectContent>
                </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="unitNumber">Status</Label>
              <Select name="status">
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      statusOptions.length &&
                      statusOptions.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
          </ColumnsContainer>
        </Fieldset>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Lease Details">
          <ColumnsContainer numberOfCols={3} marginClass="mt-5" gapClass="gap-6">
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor=""> Lease Start Date</Label>
                <Input name="leaseStartDate" required id = "leaseStartDate" type={"date"}/>
            </div>
            <div className="form-group">
                <Label className="px-2 required font-normal" htmlFor=""> Lease end Date</Label>
                <Input name="leaseEndDate" required id = "leaseEndDate" type={"date"}/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="">Lease Status</Label>
              <Select name="leaseStatus" defaultValue={leaseStatusOptions[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      leaseStatusOptions.length &&
                      leaseStatusOptions.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor=""> Currency</Label>
              <Select name="currencyType" defaultValue={currencyOptions[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      currencyOptions.length &&
                      currencyOptions.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="">Payment frequency</Label>
              <Select name="paymentFrequency" defaultValue={paymentFrequencyOptions[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      paymentFrequencyOptions.length &&
                      paymentFrequencyOptions.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
             <div className="form-group">
                <Label className="px-2 font-normal" htmlFor="monthlyRent">
                  Monthly Rent (Excl. VAT)
                </Label>
                <Input name="monthlyRent"  id="monthlyRent" />
            </div>
            <div className="form-group">
                <Label className="px-2  font-normal" htmlFor="">Grace Period (in days)</Label>
                <Input name="gracePeriod" id = "gracePeriod"/>
            </div>
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor=""> Effective Start Date</Label>
                <Input name="effectiveStartDate" required id = "effectiveStartDate" type={"date"}/>
            </div>
            <div className="form-group">
                <Label className="px-2 required font-normal" htmlFor=""> Effective end Date</Label>
                <Input
                  name="effectiveEndDate"
                  required
                  id = "effectiveEndDate" type={"date"}
                  value={formData.effectiveEndDate}
                  onChange={(e)=> handleUpdateForm("effectiveEndDate", e.target.value)}/>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <Checkbox
                  className="self-center"
                  name="vatInclusive"
                  id="vatInclusive"
              />
              <Label className="px-2 font-normal self-center" htmlFor="vatInclusive">
                  VAT Inclusive
              </Label>
            </div>
             <div className="flex flex-row gap-2 items-center justify-center">
              <Checkbox
                  className="self-center"
                  name="rentVariable"
                  id="rentVariable"
              />
              <Label className="px-2 font-normal self-center" htmlFor="vatInclusive">
                  Is Rent Variable
              </Label>
            </div>
             <div className="flex flex-row gap-2 items-center justify-center">
              <Checkbox
                  className="self-center"
                  name="includeUtilities"
                  id="includeUtilities"
              />
              <Label className="px-2 font-normal self-center" htmlFor="vatInclusive">
                  Include Utilities 
              </Label>
            </div>
          </ColumnsContainer>
        </Fieldset>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Deposit Details">
          <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6">
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="depositDate">Deposit Date</Label>
              <Input name="depositDate" id="depositDate" type="date" />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="depositCurrency">
                Deposit Currency
              </Label>
              <Select
                name="depositCurrency"
                defaultValue={currencyOptions[0].value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Deposit Currency" />
                </SelectTrigger>
                <SelectContent>
                 {
                  currencyOptions.length &&
                  currencyOptions.map((status: Option, index: number)=>
                    <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                  )
                    }
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="depositAmount">
                Deposit Amount
              </Label>
              <Input
                name="depositAmount"
                id="depositAmount"
              />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="depositHolder">
                Deposit Holder
              </Label>
              <Select
                name="depositHolder"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Deposit Holder" />
                </SelectTrigger>
                <SelectContent>
                   {
                      depositHolderOptions.length &&
                      depositHolderOptions.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                </SelectContent>
              </Select>
            </div>
          </ColumnsContainer>
        </Fieldset>
      </div>
      <Fieldset legendTitle="Tenant Opening Balance">
        <div className="w-full">
          <TableBase headers={headers}>
            <TableRow>
              <TableCell className=" text-center">Amount</TableCell>
              <TableCell className=" bg-black">
                <Input
                  name="paymentDataMoreThan3Months"
                />
              </TableCell>
              <TableCell className=" bg-red-500">
                <Input
                  name="three_months_back_balance"
                />
              </TableCell>
              <TableCell className=" bg-rose-500">
                <Input
                  name="two_months_back_balance"
                />
              </TableCell>
              <TableCell className=" bg-amber-500">
                <Input
                  name="one_month_back_balance"
                />
              </TableCell>
              <TableCell className=" bg-green-500">
                <Input
                  name="current_month_balance"                
                />
              </TableCell>
              <TableCell className=" text-center bg-green-500 text-white">
                $0.00
              </TableCell>
            </TableRow>
          </TableBase>
        </div>
      </Fieldset>
      <FormSectionHeader title="Estate Agents Section" />
      <ColumnsContainer numberOfCols={3} gapClass="gap-6">
        <div className="form-group">
          <label>Landlord type</label>
          <Select
              defaultValue={formData.landlord_type}
              onValueChange={(val: "individual" | "company") => {
                setSearchItem("")
                setFormData((prev) => ({
                  ...prev,
                  landlord_id : "",
                  landlord_name : "",
                  landlord_type: val,
                }));
                setLandlordIdentifier(val === "individual" ? "National ID" : "Registration Number");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
          </Select>
        </div>
         <AutoCompleteLandlord
            searchItem = {searchItem}
            setSearchItem = {setSearchItem}
            landlord_type = {formData.landlord_type}
            landlordIdentifier= {landlordIdentifier}
            onSelectValue = {onSelectLandlord}
         />
        <div className="form-group">
          <label className="required">Landlord Name</label>
          <Input
            type="text"
            required
            disabled
            value={formData.landlord_name}
            name="landlord_name"
          />
        </div>

        <div className="form-group">
          <Label className="px-2 font-normal required" htmlFor="commissionPercentage">
            Commission %
          </Label>
          <Input
            name="commissionPercentage"
            id="commissionPercentage"
            required            
          />
        </div>
        <div className="form-group">
          <Label className="px-2 font-normal required" htmlFor="commissionPercentage">
            Landlords Opening Balance
          </Label>
          <Input
            name="landlordsOpeningBalance"
            id="landlordsOpeningBalance"
            required
          />
        </div>
        <div className="flex flex-row gap-2 self-center">
          <Checkbox
            className="self-center"
            name="operatingCostsIncluded"
            id="operatingCostsIncluded"
            checked={formData.operatingCostsIncluded}
            onCheckedChange={(checked) => handleUpdateForm("operatingCostsIncluded", checked)}
          />
          <Label className="px-2 font-normal self-center" htmlFor="operatingCostsIncluded">
            Operating Costs Included
          </Label>
        </div>
      </ColumnsContainer>
      <div className="flex justify-end">
        <Button asChild>
          Submit
          <Plus size={18} />
        </Button> 
      </div>
    </form>
  );
}

export default AddLeaseForm;