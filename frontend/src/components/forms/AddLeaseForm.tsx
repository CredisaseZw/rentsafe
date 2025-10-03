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
import { summarizeAddress, validateAmounts } from "@/lib/utils";
import MultiAddressInput from "../general/MultiAddressInput";
import useGetLeaseInformation from "@/hooks/apiHooks/useGetLeaseInformation";
import type { Address } from "@/interfaces";

interface props {
  leaseID? : string,
  clientType : string,
  successCallback : ()=> void
}

function AddLeaseForm({clientType, successCallback, leaseID} :props) {
  const {
    headers,
    loading,
    formData,
    searchItem,
    leaseObject,
    addressState,
    propertyName,
    propertyType, 
    guaranteeItem,
    defaultCurrency,
    CURRENCY_OPTIONS,
    outstandingBalance,
    landlordIdentifier,
    primaryTenantAddress,
    tenantsOpeningBalance,
    changeTenantsOpeningBalances,
    switchToPropertyContext,
    setPrimaryTenantAddress,
    setLandlordIdentifier,
    handleDefaultCurrency,
    setOutstandingBalance,
    SET_CURRENCY_OPTIONS,
    setDefaultCurrency,
    onSelectGuarantor,
    handleLeaseSubmit,
    onSelectLandlord,
    setGuaranteeItem,
    handleUpdateForm,
    onSelectProperty,
    setPropertyTypes,
    setPropertyName,
    setLeaseObject,
    setSearchItem,
    handleCharges,
    setFormData,
  } = useAddIndividualLease();
  const useMutate = useCreateLease();
  const {data, isLoading, error} = getPropertyTypes();
  const {currencyData, currencyLoading, currencyError} = useGetCurrencies();
  const {leaseResponseObject, leaseLoading, leaseError} = useGetLeaseInformation(leaseID)

  useEffect(()=>{
    if(leaseID){
      if(isAxiosError(leaseError)){
        const message = leaseError.response?.data.error ?? leaseError.response?.data.details ?? "Something went wrong"
        toast.error("Failed to fetch lease details", { description: message });
        return;
      }

      if(leaseResponseObject){
        setDefaultCurrency(leaseResponseObject?.currency?.id)
        setPropertyName(`${leaseResponseObject.unit.property.name} - ${summarizeAddress(leaseResponseObject?.unit.property.addresses[0] ?? {} as Address)}`)
        setSearchItem(leaseResponseObject?.landlord_opening_balances_data?.[0]?.landlord?.landlord_name ?? "")
        setGuaranteeItem(leaseResponseObject?.guarantor?.guarantor_object.identification_number ?? "")        
        handleCharges(leaseResponseObject?.charges ?? [])
        setOutstandingBalance((p)=>({...p, value : leaseResponseObject.lease_opening_balance_data.outstanding_balance ?? "" }))
        setFormData((p) => ({
          ...p,
          lockLandlord : true,
          property : {name : leaseResponseObject?.unit?.property?.name ?? ""},
          address_object : leaseResponseObject?.unit.property.addresses[0] ?? {} as Address,
          landlord_id: Number(leaseResponseObject?.landlord_opening_balances_data?.[0]?.landlord?.landlord_id),
          landlord_type : leaseResponseObject.landlord_opening_balances_data?.[0]?.landlord?.landlord_type ?? "individual",
          landlord_name: leaseResponseObject?.landlord_opening_balances_data?.[0]?.landlord?.landlord_name ?? "",
          guarantor_id: leaseResponseObject?.guarantor?.guarantor_object?.id ?? "",
          guarantor_name: leaseResponseObject?.guarantor?.guarantor_object?.full_name.toString() ?? ""
        }));

        setLeaseObject(leaseResponseObject)
      }
    }
  }, [leaseID, leaseResponseObject, leaseError])

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
    if (currencyData) { 
      SET_CURRENCY_OPTIONS(currencyData);
      handleDefaultCurrency(currencyData); 
    }

  }, [currencyData, currencyError])

  return (
    <form className="w-full relative" onSubmit={(e: FormEvent<HTMLFormElement>)=> handleLeaseSubmit(useMutate, e, clientType, successCallback, leaseID)}>
      {
        leaseID && leaseLoading &&
        <div className="absolute h-full w-full bg-white bottom-0 top-0 z-50">
          <div className="h-[25vh] justify-center items-center flex">
            <LoadingIndicator/>
          </div>
        </div>
      }
      <div className="mt-5">
        <MultipleTenantInput
          existingTenants = {leaseObject?.tenants }
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
                  defaultValue={leaseObject?.guarantor?.guarantee_amount ?? ""}
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
              addressState === "property" &&
              <AutoCompleteProperty
                searchItem= {propertyName}
                setSearchItem={setPropertyName}
                onSelectValue={onSelectProperty}
                alternativeOption={switchToPropertyContext}
              />
            }
            
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber" >Unit Number </Label>
              <Input
                id="unitNumber"
                required
                defaultValue={leaseObject?.unit.unit_number ?? ""}
                name="unitNumber"/>
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Number of Rooms </Label>
              <Input 
                id=""
                name="unitNumberOfRooms"
                required
                defaultValue={leaseObject?.unit.number_of_rooms ?? ""}
                type= "number"
                step={0.01}
                onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                onKeyDown={validateAmounts}/>
            </div>      
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="unitNumber">Unit Type</Label>
              <Select
                  key = {leaseObject?.unit.unit_type}
                  required
                  name="unitType"
                  value={leaseObject?.unit.unit_type}
                  >
                  
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
              (addressState === "client" || addressState === "manual") &&
              primaryTenantAddress !== undefined && (
                <>
                  <ColumnsContainer numberOfCols={2} marginClass="mt-6" gapClass="gap-6">
                    <div className="flex flex-col justify-baseline form-group">
                      <Label className="px-2 font-normal required" htmlFor="">
                        Property Type
                      </Label>
                      <Select name="propertyTypeName" required>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyType &&
                            propertyType.map((property_type) => (
                              <SelectItem
                                value={property_type.name || ""}
                                key={property_type.id}
                              >
                                {property_type.name}
                              </SelectItem>
                            ))}
                          {!propertyType && isLoading && (
                            <SelectItem
                              disabled
                              value="loading"
                              className="text-center flex flex-col justify-center items-center"
                            >
                              <LoadingIndicator />
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label className="px-2 font-normal required" htmlFor="propertyName">
                        Building/Complex Name
                      </Label>
                      <Input name="propertyName" id="propertyName" required />
                    </div>
                  </ColumnsContainer>

                  {addressState === "client" && (
                    <ColumnsContainer numberOfCols={3}>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="streetAddress">
                          Street Address
                        </Label>
                        <Input
                          name="streetAddress"
                          value={primaryTenantAddress.street_address}
                          disabled
                          id="streetAddress"
                        />
                      </div>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="">
                          Suburb
                        </Label>
                        <Input
                          name="suburb"
                          value={primaryTenantAddress.suburb?.name}
                          disabled
                          id="suburb"
                        />
                      </div>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="">
                          City
                        </Label>
                        <Input
                          name="city"
                          value={primaryTenantAddress.city?.name}
                          disabled
                          id="city"
                        />
                      </div>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="">
                          Province
                        </Label>
                        <Input
                          name="province"
                          value={primaryTenantAddress.province?.name}
                          disabled
                          id="province"
                        />
                      </div>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="">
                          Country
                        </Label>
                        <Input
                          name="country"
                          value={primaryTenantAddress.country?.name}
                          disabled
                          id="country"
                        />
                      </div>
                      <div className="form-group">
                        <Label className="px-2 font-normal" htmlFor="">
                          Area Code
                        </Label>
                        <Input
                          name="postal_code"
                          defaultValue={primaryTenantAddress.postal_code?.toString()}
                          disabled
                          id="postal_code"
                        />
                      </div>
                    </ColumnsContainer>
                  )}
                   <div className="form-group mt-6">
                    <Label className="px-2 font-normal required" htmlFor="">
                      Property Details
                    </Label>
                    <Textarea name="propertyDetails" required placeholder="" />
                  </div>
                  {
                    addressState ===  "manual" &&
                    <MultiAddressInput className="mt-5" isMultiple={false} />
                  }
                </>
              )
            }

        </Fieldset>
      </div>
      <div className="mt-5">
        <Fieldset legendTitle="Lease Details">
          <ColumnsContainer numberOfCols={3} marginClass="mt-5" gapClass="gap-6">
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor=""> Lease Start Date</Label>
                <Input defaultValue={leaseObject?.start_date ?? ""} name="leaseStartDate" required id = "leaseStartDate" type={"date"}/>
            </div>
            <div className="form-group">
                <Label className="px-2 required font-normal" htmlFor=""> Lease end Date</Label>
                <Input defaultValue={leaseObject?.end_date ?? ""} name="leaseEndDate" required id = "leaseEndDate" type={"date"}/>
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
              <Select name="currencyType" key={defaultCurrency} required defaultValue={defaultCurrency.toString()}>
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
              <Select name="paymentFrequency" defaultValue={leaseObject?.payment_frequency ?? PAYMENT_FREQUENCY_OPTIONS[0].value}>
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
                  defaultValue={formData.defaultRent }
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
                  defaultValue={formData.defaultUtility}
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
                  defaultValue={leaseObject?.grace_period_days ?? formData.effectiveEndDate}
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
                checked={leaseObject?.is_rent_variable ?? false}
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
              <Input defaultValue={leaseObject?.deposits[0].deposit_date} name="depositDate" required id="depositDate" type="date" />
            </div>
            <div className="form-group">
              <Label className="px-2 font-normal required" htmlFor="depositCurrency">
                Deposit Currency
              </Label>
              <Select
                required
                defaultValue={
                  leaseObject?.deposits?.[0]?.currency?.toString() ?? defaultCurrency.toString()
                }
                name="depositCurrency"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Deposit Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((c: Currency) => (
                    <SelectItem value={c.id.toString()} key={c.id}>
                      {c.currency_code + " " + c.currency_name}
                    </SelectItem>
                  ))}
                  {CURRENCY_OPTIONS.length === 0 && currencyLoading && (
                    <SelectItem
                      disabled
                      value="loading"
                      className="text-center flex flex-col justify-center items-center"
                    >
                      <LoadingIndicator />
                    </SelectItem>
                  )}
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
                defaultValue={leaseObject?.deposits[0].amount}
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
                key={leaseObject?.deposits?.[0]?.deposit_holder}
                required
                name="depositHolder"
                defaultValue={leaseObject?.deposits?.[0]?.deposit_holder}
                >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Deposit Holder" />
                </SelectTrigger>
                <SelectContent>
                  {DEPOSIT_HOLDER_OPTIONS.map((status: Option, index: number) => (
                    <SelectItem value={status.value} key={index}>
                      {status.label}
                    </SelectItem>
                  ))}
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
                  defaultValue={leaseObject?.lease_opening_balance_data.three_months_plus_balance ?? tenantsOpeningBalance.three_months_back_plus_balance.value}
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
                  defaultValue={leaseObject?.lease_opening_balance_data.three_months_back_balance ??tenantsOpeningBalance.three_months_back_balance.value}
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
                  defaultValue={leaseObject?.lease_opening_balance_data.two_months_back_balance ?? tenantsOpeningBalance.two_months_back_balance.value}
                />
              </TableCell>
              <TableCell className={tenantsOpeningBalance.one_month_back_balance.colorCode}>
                <Input
                  type= "number" 
                  step={0.01}
                  onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                  onKeyDown={validateAmounts}
                  defaultValue ={leaseObject?.lease_opening_balance_data.one_month_back_balance ?? tenantsOpeningBalance.one_month_back_balance.value}
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
                  defaultValue={leaseObject?.lease_opening_balance_data.current_month_balance ?? tenantsOpeningBalance.current_month_balance.value}
                  name="current_month_balance"                
                />
              </TableCell>
              <TableCell className={`text-center text-white ${outstandingBalance.colorCode}`}>
                {
                outstandingBalance.value.length ?
                `$${leaseObject?.lease_opening_balance_data.outstanding_balance ??  outstandingBalance.value}` : 
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
              disabled = {formData.lockLandlord}
              defaultValue={leaseObject?.landlord_opening_balances_data?.[0]?.landlord?.landlord_type.toString() ?? formData.landlord_type}
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
            disableSearch = {formData.lockLandlord}
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
            defaultValue={leaseObject?.landlord_opening_balances_data?.[0]?.commission_percentage}
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
            defaultValue={leaseObject?.landlord_opening_balances_data?.[0]?.amount}
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
            checked = {leaseObject?.landlord_opening_balances_data?.[0]?.operating_costs_inclusive ?? false}
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