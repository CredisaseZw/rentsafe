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
import type { Currency, Option } from "@/types";
import { Plus } from "lucide-react";
import MultipleTenantInput from "../general/MultipleTenantInput";
import AutoCompleteClient from "../general/AutoCompleteClient";
import ButtonSpinner from "../general/ButtonSpinner";
import useCreateLease from "@/hooks/apiHooks/useCreateLease";
import { useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import getPropertyTypes from "@/hooks/apiHooks/useGetPropertyTypes";
import LoadingIndicator from "../general/LoadingIndicator";
import { Textarea } from "../ui/textarea";
import { DEPOSIT_HOLDER_OPTIONS, IN_LEASE_CLIENT_TYPES, LEASE_STATUS_OPTIONS, PAYMENT_FREQUENCY_OPTIONS, UNIT_TYPES } from "@/constants";
import { isAxiosError } from "axios";
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies";
import { validateAmounts } from "@/lib/utils";

interface props {
  clientType : string,
  successCallback : ()=> void
}

function AddLeaseForm({clientType, successCallback} :props) {
  const {
    headers,
    loading,
    formData,
    searchItem,
    propertyName,
    propertyType, 
    guaranteeItem,
    CURRENCY_OPTIONS,
    manualLogProperty,
    outstandingBalance,
    landlordIdentifier,
    primaryTenantAddress,
    tenantsOpeningBalance,
    changeTenantsOpeningBalances,
    switchToPropertyContext,
    setPrimaryTenantAddress,
    setLandlordIdentifier,
    SET_CURRENCY_OPTIONS,
    onSelectGuarantor,
    handleLeaseSubmit,
    onSelectLandlord,
    setGuaranteeItem,
    handleUpdateForm,
    onSelectProperty,
    setPropertyTypes,
    setPropertyName,
    setSearchItem,
    setFormData,
  } = useAddIndividualLease();
  const useMutate = useCreateLease();
  const {data, isLoading, error} = getPropertyTypes();
  const {currencyData, currencyLoading, currencyError} = useGetCurrencies();

  useEffect(()=>{
    if(isAxiosError(error)){
      const message = error.response?.data.error ?? error.response?.data.details ?? "Something went wrong"
      toast.error("Failed to fetch property types", { description: message });
      return;
    }
    if (data) { setPropertyTypes(data.results ?? []); }
  }, [data, error])

  useEffect(()=>{
    if(isAxiosError(currencyError)){
      const message = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
      toast.error("Failed to fetch currencies", { description: message });
      return;
    }
    if (currencyData) { SET_CURRENCY_OPTIONS(currencyData ?? []) }
  }, [currencyData, currencyData])

  return (
    <form className="w-full" onSubmit={(e: FormEvent<HTMLFormElement>)=> handleLeaseSubmit(useMutate, e, clientType, successCallback)}>
      <div className="mt-5">
        <MultipleTenantInput
          clientType = {clientType}
          setPrimaryTenantAddress = {setPrimaryTenantAddress}/>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Rent Guarantor">
          <ColumnsContainer numberOfCols={3} marginClass="mt-0" gapClass="gap-6" >
            <div className="form-group">
              <AutoCompleteClient
                isRequired = {false}
                searchItem = {guaranteeItem}
                setSearchItem = {setGuaranteeItem}
                clientType = {"individual"}
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
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
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
            {
              manualLogProperty === false &&
              <AutoCompleteProperty
                searchItem= {propertyName}
                setSearchItem={setPropertyName}
                onSelectValue={onSelectProperty}
                alternativeOption={switchToPropertyContext}
              />
            }
            
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber" >Unit Number </Label>
              <Input id="unitNumber" required name="unitNumber"/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Number of Rooms </Label>
              <Input id="" name="unitNumberOfRooms" required  type= "number"
                step={0.01}
                onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                onKeyDown={validateAmounts}/>
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
                      UNIT_TYPES.length &&
                      UNIT_TYPES.map((u:Option, index: number )=>
                        <SelectItem value={u.value} key={index}>{u.label}</SelectItem>
                      )
                    }

                  </SelectContent>
                </Select>
            </div>
          </ColumnsContainer>
           {
              manualLogProperty && primaryTenantAddress !== undefined && <>
              <ColumnsContainer numberOfCols={3} marginClass="mt-6" gapClass="gap-6">
                  <div className="flex flex-col justify-baseline form-group">
                    <Label className="px-2 font-normal required" htmlFor="">
                      Property Type
                    </Label>
                    <Select
                      name="propertyTypeName"
                      required
                    >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                      <SelectContent>
                        {
                          propertyType &&
                          propertyType.map((property_type)=>
                            <SelectItem value={property_type.name || ""} key={property_type.id}>{property_type.name}</SelectItem>
                          )
                        }
                        { 
                          !propertyType &&
                          isLoading &&
                          <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                              <LoadingIndicator />
                            </SelectItem>
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="form-group">
                    <Label className="px-2 font-normal required" htmlFor="propertyName">
                        Building/Complex Name
                      </Label>
                    <Input name="propertyName"  id="propertyName" required />
                  </div>
                  <div className="form-group">
                      <Label className="px-2 font-normal"  htmlFor="streetAddress">
                        Street Address
                      </Label>
                      <Input name="streetAddress" value={primaryTenantAddress.street_address} disabled  id="streetAddress" />
                  </div>
                  <div className="form-group">
                      <Label className="px-2 font-normal" htmlFor="">
                       Suburb
                      </Label>
                      <Input name="suburb" value={primaryTenantAddress.suburb?.name} disabled id="suburb" />
                  </div>
                  <div className="form-group">
                      <Label className="px-2 font-normal" htmlFor="">
                        City
                      </Label>
                      <Input name="city" value={primaryTenantAddress.city?.name} disabled id="city" />
                  </div>
                  <div className="form-group">
                      <Label className="px-2 font-normal" htmlFor="">
                        Province
                      </Label>
                      <Input name="province" value = {primaryTenantAddress.province?.name} disabled id="province" />
                  </div>
                   <div className="form-group">
                      <Label className="px-2 font-normal" htmlFor="">
                        Country
                      </Label>
                      <Input name="province" value = {primaryTenantAddress.country?.name} disabled id="province" />
                  </div>
                   <div className="form-group">
                      <Label className="px-2 font-normal" htmlFor="">
                        Area Code
                      </Label>
                      <Input name="province" value={primaryTenantAddress.postal_code?.toString()} disabled id="province" />
                  </div>
              </ColumnsContainer>
              <div className="form-group mt-6">
                  <Label className="px-2 font-normal required" htmlFor="">Property Details</Label>
                  <Textarea name = "propertyDetails" required placeholder=""></Textarea>
              </div>
              </>
            }
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
              <Select name="leaseStatus" defaultValue={LEASE_STATUS_OPTIONS[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      LEASE_STATUS_OPTIONS.length &&
                      LEASE_STATUS_OPTIONS.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor=""> Currency</Label>
              <Select name="currencyType" required>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      CURRENCY_OPTIONS.map((c:Currency)=>
                        <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>
                      )
                    }
                    { 
                      CURRENCY_OPTIONS.length === 0 &&
                      currencyLoading &&
                      <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                          <LoadingIndicator />
                        </SelectItem>
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal" htmlFor="">Payment frequency</Label>
              <Select name="paymentFrequency" defaultValue={PAYMENT_FREQUENCY_OPTIONS[0].value}>
                 <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      PAYMENT_FREQUENCY_OPTIONS.length &&
                      PAYMENT_FREQUENCY_OPTIONS.map((status: Option, index: number)=>
                        <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                      )
                    }
                  </SelectContent>
              </Select>
            </div>
             <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor="monthlyRent">
                  Monthly Rent (Excl. VAT)
                </Label>
                <Input 
                  name="monthlyRent"
                  id="monthlyRent"
                  type= "number"
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  required/>
            </div>
            <div className="form-group">
                <Label className="px-2  font-normal" htmlFor="">Other standing Charges</Label>
                <Input 
                  name="otherStandingCharging"
                  id = "otherStandingCharging"
                  type= "number"
                  step={0.01} 
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}/>
            </div>
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor=""> Payment Start Date</Label>
                <Input name="effectiveStartDate" required id = "effectiveStartDate" value={25} readOnly/>
            </div>
            <div className="form-group">
                <Label className="px-2 required font-normal" htmlFor=""> Payment end Date</Label>
                <Input
                  name="effectiveEndDate"
                  required
                  id = "effectiveEndDate" type={"number"}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
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
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Deposit Currency" />
                </SelectTrigger>
                <SelectContent>
                    {
                      CURRENCY_OPTIONS.map((c:Currency)=>
                        <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>
                      )
                    }
                    { 
                      CURRENCY_OPTIONS.length === 0 &&
                      currencyLoading &&
                      <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                          <LoadingIndicator />
                        </SelectItem>
                    }
                  </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="depositAmount">
                Deposit Amount 
              </Label>
              <Input
                type= "number" 
                step={0.01}
                onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                onKeyDown={validateAmounts}
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
                      DEPOSIT_HOLDER_OPTIONS.length &&
                      DEPOSIT_HOLDER_OPTIONS.map((status: Option, index: number)=>
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
                  type="number"
                  step="0.01"
                  name="paymentDataMoreThan3Months"
                  value={tenantsOpeningBalance.three_months_back_plus_balance.value}
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={validateAmounts} 
                  onChange={(e) =>
                    changeTenantsOpeningBalances(
                      "three_months_back_plus_balance",
                      e.currentTarget.value
                    )
                  }
                />

              </TableCell>
              <TableCell className={tenantsOpeningBalance.three_months_back_balance.colorCode}>
                <Input
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  name="three_months_back_balance"
                  value={tenantsOpeningBalance.three_months_back_balance.value}
                  onChange={(val) => changeTenantsOpeningBalances("three_months_back_balance", val.target.value)}
                
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.two_months_back_balance.colorCode}>
                <Input
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  name="two_months_back_balance"
                  onChange={(val) => changeTenantsOpeningBalances("two_months_back_balance", val.target.value)}
                  value={tenantsOpeningBalance.two_months_back_balance.value}
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.one_month_back_balance.colorCode}>
                <Input
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  value={tenantsOpeningBalance.one_month_back_balance.value}
                  onChange={(val) => changeTenantsOpeningBalances("one_month_back_balance", val.target.value)}
                  name="one_month_back_balance"
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.current_month_balance.colorCode}>
                <Input
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  onChange={(val) => changeTenantsOpeningBalances("current_month_balance", val.target.value)}
                  value={tenantsOpeningBalance.current_month_balance.value}
                  name="current_month_balance"                
                />
              </TableCell>
              <TableCell className={`text-center text-white ${outstandingBalance.colorCode}`}>
                {
                outstandingBalance.value.length ?
                `$${outstandingBalance.value}` : 
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
                  IN_LEASE_CLIENT_TYPES.map((option:Option, index : number)=>
                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                  )
                }
              </SelectContent>
          </Select>
        </div>
         <AutoCompleteClient
            isRequired = {false}
            searchItem = {searchItem}
            setSearchItem = {setSearchItem}
            clientType = {formData.landlord_type}
            clientLabel= {landlordIdentifier}
            onSelectValue = {onSelectLandlord}
         />
        <div className="form-group">
          <label >Landlord Name</label>
          <Input
            type="text"
            disabled
            value={formData.landlord_name}
            name="landlord_name"
          />
        </div>

        <div className="form-group">
          <Label className="px-2 font-normal" htmlFor="commissionPercentage">
            Commission %
          </Label>
          <Input
            type= "number" 
            step={0.01}
            min = {0}
            max = {100}
            onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
            onKeyDown={validateAmounts}
            name="commissionPercentage"
            id="commissionPercentage"            
          />
        </div>
        <div className="form-group">
          <Label className="px-2 font-normal" htmlFor="commissionPercentage">
            Landlords Opening Balance
          </Label>
          <Input
            type= "number" 
            step={0.01}
            onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
            onKeyDown={validateAmounts}
            name="landlordsOpeningBalance"
            id="landlordsOpeningBalance"
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