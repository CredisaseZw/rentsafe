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
import Fieldset from "../general/Fieldset";
import AutoCompleteProperty from "../general/AutoCompleteProperty";
import type {  Option } from "@/types";
import { Plus } from "lucide-react";
import MultipleTenantInput from "../general/MultipleTenantInput";
import AutoCompleteClient from "../general/AutoCompleteClient";
import ButtonSpinner from "../general/ButtonSpinner";
import useCreateLease from "@/hooks/apiHooks/useCreateLease";
import type { FormEvent } from "react";

interface props {
  clientType : string,
  successCallback : ()=> void
}

function AddLeaseForm({clientType, successCallback} :props) {
  const {
    headers,
    loading,
    formData,
    unitTypes,
    searchItem,
    propertyName,
    statusOptions,
    guaranteeItem,
    guarantorTypes,
    currencyOptions,
    inLeaseClientTypes,
    outstandingBalance,
    landlordIdentifier,
    leaseStatusOptions,
    depositHolderOptions,
    tenantsOpeningBalance,
    paymentFrequencyOptions,
    changeTenantsOpeningBalances,
    setLandlordIdentifier,
    onSelectGuarantor,
    handleLeaseSubmit,
    onSelectLandlord,
    setGuaranteeItem,
    handleUpdateForm,
    onSelectProperty,
    setPropertyName,
    setSearchItem,
    setFormData,
  } = useAddIndividualLease();
  const useMutate = useCreateLease();
 

  return (
    <form className="w-full" onSubmit={(e: FormEvent<HTMLFormElement>)=> handleLeaseSubmit(useMutate, e, clientType, successCallback)}>
      <div className="mt-5">
        <MultipleTenantInput clientType = {clientType}/>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Rent Guarantor">
          <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6" >
           <div className="form-group flex self-baseline-last">
              <Label className="px-2 font-normal" htmlFor="">Guarantor Type</Label>
              <Select
                onValueChange={(val: "individual" | "company") => {
                  setSearchItem("")
                  setFormData((prev) => ({
                    ...prev,
                    guarantor_id : "",
                    guarantor_name : "",
                    guarantor_type: val,
                    }));
                  }
              
                }
                name="guarantorType"
                defaultValue={guarantorTypes[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      guarantorTypes.length &&
                      guarantorTypes.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <AutoCompleteClient
                searchItem = {guaranteeItem}
                setSearchItem = {setGuaranteeItem}
                clientType = {formData.guarantor_type}
                clientLabel= {"Rent Guarantor ID"}
                onSelectValue = {onSelectGuarantor}
              />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="rentGuarantorName">
                  Rent Guarantor Name
              </Label>
              <Input
                  name={`rentGuarantorName`}
                  id="rentGuarantorName"
                  readOnly
                  value={formData.guarantor_name}
              />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="rentGuarantorName">
                  Guarantee Amount 
              </Label>
              <Input
                  name={`rentGuaranteeAmount`}
                  id="rentGuaranteeAmount"
              />
            </div>
          </ColumnsContainer>
        </Fieldset>
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
              <Input id="" name="unitNumberOfRooms" required/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Unit type</Label>
              <Select
                  required
                  name="unitType">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      unitTypes.length &&
                      unitTypes.map((u:Option, index: number )=>
                        <SelectItem value={u.value} key={index}>{u.label}</SelectItem>
                      )
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
                <Label className="px-2  font-normal" htmlFor="">Other standing Charges</Label>
                <Input name="otherStandingCharging" id = "otherStandingCharging"/>
            </div>
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor=""> Effective Start Date</Label>
                <Input name="effectiveStartDate" required id = "effectiveStartDate" value={25} readOnly/>
            </div>
            <div className="form-group">
                <Label className="px-2 required font-normal" htmlFor=""> Effective end Date</Label>
                <Input
                  name="effectiveEndDate"
                  required
                  id = "effectiveEndDate" type={"number"}
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
          </ColumnsContainer>
        </Fieldset>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Deposit Details">
          <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6">
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="depositDate">Deposit Date</Label>
              <Input name="depositDate" required id="depositDate" type="date" />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="depositCurrency">
                Deposit Currency
              </Label>
              <Select
                required
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
              <Label className="px-2 font-normal required" htmlFor="depositAmount">
                Deposit Amount 
              </Label>
              <Input
                required
                name="depositAmount"
                id="depositAmount"
              />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="depositHolder">
                Deposit Holder
              </Label>
              <Select
                required
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
              <TableCell className = {tenantsOpeningBalance.three_months_back_plus_balance.colorCode}>
                <Input
                  name="paymentDataMoreThan3Months"
                  value={tenantsOpeningBalance.three_months_back_plus_balance.value}
                  onChange={(val) => changeTenantsOpeningBalances("three_months_back_plus_balance", val.target.value)}
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.three_months_back_balance.colorCode}>
                <Input
                  name="three_months_back_balance"
                  value={tenantsOpeningBalance.three_months_back_balance.value}
                  onChange={(val) => changeTenantsOpeningBalances("three_months_back_balance", val.target.value)}
                
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.two_months_back_balance.colorCode}>
                <Input
                  name="two_months_back_balance"
                  onChange={(val) => changeTenantsOpeningBalances("two_months_back_balance", val.target.value)}
                  value={tenantsOpeningBalance.two_months_back_balance.value}
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.one_month_back_balance.colorCode}>
                <Input
                  value={tenantsOpeningBalance.one_month_back_balance.value}
                  onChange={(val) => changeTenantsOpeningBalances("one_month_back_balance", val.target.value)}
                  name="one_month_back_balance"
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.current_month_balance.colorCode}>
                <Input
                  onChange={(val) => changeTenantsOpeningBalances("current_month_balance", val.target.value)}
                  value={tenantsOpeningBalance.current_month_balance.value}
                  name="current_month_balance"                
                />
              </TableCell>
              <TableCell className={`text-center text-white ${outstandingBalance.colorCode}`}>
                {
                outstandingBalance.value.length ?
                `$${outstandingBalance.value}.00` : 
                "$0.00"
                }
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
                {
                  inLeaseClientTypes.map((option:Option, index : number)=>
                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                  )
                }
              </SelectContent>
          </Select>
        </div>
         <AutoCompleteClient
            searchItem = {searchItem}
            setSearchItem = {setSearchItem}
            clientType = {formData.landlord_type}
            clientLabel= {landlordIdentifier}
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
           />
          <Label className="px-2 font-normal self-center" htmlFor="operatingCostsIncluded">
            Operating Costs Included
          </Label>
        </div>
      </ColumnsContainer>
      <div className="flex justify-end">
        <Button asChild type="submit" disabled = {loading}>
          Submit
          {
            loading ? <ButtonSpinner/> :
            <Plus size={18} />
          }
        </Button> 
      </div>
    </form>
  );
}

export default AddLeaseForm;