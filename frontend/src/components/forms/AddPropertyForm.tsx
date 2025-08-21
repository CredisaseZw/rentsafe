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
import type { Property } from "@/types";
import React from "react";
import AutoCompleteLandlord from "../general/AutoCompleteLandlord";
import MultiAddressInput from "../general/MultiAddressInput";

function AddPropertyForm() {
   const { addPropertyForm,
      landlordIdentifier,
      searchItem,
      setSearchItem,
      onInputChange, 
      onSelectChange, 
      setAddPropertyForm,
      setLandlordIdentifier } = usePropertyList();

  const submitAddPropertyForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(addPropertyForm);
    const property:Property = {} 
  };


  return (
    <form onSubmit={submitAddPropertyForm} method="post" className="space-y-6">
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
              <SelectItem value="Residental House">Residental - House</SelectItem>
              <SelectItem value="Residental Cottage">Residental - Cottage</SelectItem>
              <SelectItem value="Residental Townhouse">Residental - Townhouse</SelectItem>
              <SelectItem value="Residental Flats">Residental - Flats</SelectItem>
              <SelectItem value="Residental Small Holdings">
                Residental - Small Holdings
              </SelectItem>
              <SelectItem value="Commercial Offices">Commercial - Offices</SelectItem>
              <SelectItem value="Commercial Industrial">Commercial - Industrial</SelectItem>
              <SelectItem value="Commercial Hospitality">
                Commercial - Hospitality
              </SelectItem>
              <SelectItem value="Agricultural Plot">Agricultural - Plot</SelectItem>
              <SelectItem value="Agricultural Small Farm">
                Agricultural - Small Farm
              </SelectItem>
              <SelectItem value="Agricultural Commercial Farm">
                Agricultural - Commercial Farm
              </SelectItem>
              <SelectItem value="Land Undeveloped">Land - Undeveloped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="form-group">
          <label>Property Details</label>
          <Textarea
            onChange={onInputChange}
            value={addPropertyForm.property_details}
            name="property_details"
            placeholder="i.e Rooms, Size,"
          />
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="form-group">
          <label>Unit Number</label>
          <Input
            type="text"
            onChange={onInputChange}
            value={addPropertyForm.unit_number}
            name="unit_number"
          />
        </div>
        <div className="form-group">
          <label>Building/Complex Name</label>
          <Input
            type="text"
            onChange={onInputChange}
            value={addPropertyForm.building_name}
            name="building_name"
          />
        </div>
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
         <AutoCompleteLandlord
            searchItem = {searchItem}
            setSearchItem = {setSearchItem}
            setAddPropertyForm = {setAddPropertyForm}
            landlordIdentifier= {landlordIdentifier}
            addPropertyForm={addPropertyForm}
         />
        <div className="form-group">
          <label className="required">Landlord Name</label>
          <Input
            type="text"
            required
            disabled
            value={addPropertyForm.landlord_name}
            name="landlord_name"
          />
        </div>
      </div>

      <div className="mt-5 flex w-full justify-end">
        <Button type="submit" className="bg-PRIMARY flex flex-row gap-3">
          <Plus size={15} className="self-center" />
          <span>Submit</span>
        </Button>
      </div>
    </form>
  );
}

export default AddPropertyForm;
