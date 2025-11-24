import Button from "../general/Button";
import { Plus } from "lucide-react";
import usePropertyList from "@/hooks/components/usePropertyList";
import FormSectionHeader from "../general/FormSectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import React from "react";
import MultiAddressInput from "../general/MultiAddressInput";
import LoadingIndicator from "../general/LoadingIndicator";
import { Label } from "../ui/label";
import { Checkbox } from "@/components/ui/checkbox"
import useCreateProperty from "@/hooks/apiHooks/useCreateProperty";
import ButtonSpinner from "../general/ButtonSpinner";
import type { Option } from "@/types";
import Fieldset from "../general/Fieldset";
import AutoCompleteClient from "../general/AutoCompleteClient";
import {  validateAmounts } from "@/lib/utils";
import { BACKUP_POWER_OPTIONS, PARKING_OPTIONS, PROPERTY_STATUS_OPTIONS, SECURITY_OPTIONS } from "@/constants";
interface props{
  successCallback : ()=>void
}

function AddPropertyForm({successCallback}:props) {
  const { 
    addPropertyForm,
    landlordIdentifier,
    searchItem,
    propertyTypes,
    loading,
    isLoading,
    onSelectValue,
    handleFeatureChange,
    handleAddProperty,
    setSearchItem, 
    onSelectChange, 
    setAddPropertyForm,
    setLandlordIdentifier } = usePropertyList();
  const newProperty = useCreateProperty();

  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
        handleAddProperty(newProperty, e, successCallback)
      }} method="post" className="space-y-6">
       <div className="form-group">
          <label className="required">Property Type</label>
          <Select
            name="property_type"
            value={addPropertyForm.property_type}
            onValueChange={(val) => onSelectChange("property_type", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ..." />
            </SelectTrigger>
            <SelectContent>
              {
                propertyTypes &&
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
          <label >Property Details</label>
          <Textarea
            name="property_details"
            placeholder="i.e Rooms, Size,"
          />
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className=" form-group">
          <label>Total number of units</label>
          <Input
            step={0.01}
            onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
            onKeyDown={validateAmounts}
            type="number"
            name="total_number_of_units"
          />
        </div>
        <div className=" form-group">
          <label>Building/Complex Name</label>
          <Input
            type="text"
            name="building_name"
          />
        </div>
        <div className="form-group">
          <label>Total Area</label>
           <Input
            name="total_area"
            type= "number"
            step={0.01}
            onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
            onKeyDown={validateAmounts}
          />
        </div>
        <div className="form-group">
          <label>Year Built</label>
           <Input
            name="year_built"
            type= "number"
            step={0.01}
            onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
            onKeyDown={validateAmounts}
          />
        </div>
        <div className="form-group">
          <label className="required">Status</label>
          <Select
              required
              onValueChange={(val) => {
                setAddPropertyForm((prev) => ({
                  ...prev,
                  status : val
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                {
                  PROPERTY_STATUS_OPTIONS.map((option:Option, index:number)=>(
                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                  ))
                }
              </SelectContent>
          </Select>
        </div>   
        <div className="form-group">
            <label >Furnished</label>
          <div className="flex flex-row gap-2 items-center">
            <Checkbox
              checked={addPropertyForm.is_furnished}
              onCheckedChange={(checked: boolean) => {
                setAddPropertyForm((prev) => ({
                  ...prev,
                  is_furnished: checked,
                }));
              }}
              className="h-4 w-4 self-center"
            />
            <label className="ml-2">Yes</label>
          </div>
        </div>
      </div>
      <div>
        <Fieldset legendTitle="Features">
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="parking">Parking</Label>
                <Select
                  value={addPropertyForm.features.parking}
                  onValueChange={(val) => handleFeatureChange("parking", val)}>
                <SelectTrigger id="parking" className="w-full">
                    <SelectValue placeholder="Select parking type" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      PARKING_OPTIONS.map((option:Option, index:number)=>(
                        <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="security">Security</Label>
                <Select
                  value={addPropertyForm.features.security}
                  onValueChange={(val) => handleFeatureChange("security", val)}
                >
                  <SelectTrigger id="security" className="w-full">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      SECURITY_OPTIONS.map((option:Option, index:number)=>(
                        <SelectItem value= {option.value} key={index}>{option.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="backup_power">Backup Power</Label>
                <Select
                  value={addPropertyForm.features.backup_power}
                  onValueChange={(val) => handleFeatureChange("backup_power", val)}
                  >
                  <SelectTrigger id="backup_power" className="w-full">
                    <SelectValue placeholder="Select power backup" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      BACKUP_POWER_OPTIONS.map((option: Option, index: number)=> (
                        <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
      <div>
        <MultiAddressInput isMultiple = {false}/>
      </div>
      <FormSectionHeader title="Landlord" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="form-group">
          <label>Landlord type</label>
          <Select
              defaultValue={addPropertyForm.landlord_type}
              onValueChange={(val: "individual" | "company") => {
                setSearchItem("")
                setAddPropertyForm((prev) => ({
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
         <AutoCompleteClient
            isRequired = {false}
            searchItem = {searchItem}
            setSearchItem = {setSearchItem}
            clientType = {addPropertyForm.landlord_type}
            clientLabel= {landlordIdentifier}
            onSelectValue = {onSelectValue}
            createClient
         />
        <div className="form-group">
          <label>Landlord Name</label>
          <Input
            type="text"
            disabled
            value={addPropertyForm.landlord_name}
            name="landlord_name"
          />
        </div>
      </div>

      <div className="mt-5 flex w-full justify-end">
        <Button type="submit" className="bg-PRIMARY flex flex-row gap-3" disabled = {loading}>
          {
            loading ? <ButtonSpinner/> : 
           <Plus size={15} className="self-center" />
          }
          <span>Submit</span>
        </Button>
      </div>
    </form>
  );
}

export default AddPropertyForm;
