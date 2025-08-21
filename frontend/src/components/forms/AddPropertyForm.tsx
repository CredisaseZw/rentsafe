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
import React, { useEffect } from "react";
import AutoCompleteLandlord from "../general/AutoCompleteLandlord";
import MultiAddressInput from "../general/MultiAddressInput";
import getPropertyTypes from "@/hooks/apiHooks/useGetPropertyTypes";
import LoadingIndicator from "../general/LoadingIndicator";
import { extractAddresses } from "@/lib/utils";
import { Label } from "../ui/label";
import { Checkbox } from "@/components/ui/checkbox"
import useCreateProperty from "@/hooks/apiHooks/useCreateProperty";
import { isAxiosError } from "axios";
import { toast } from "sonner"
import ButtonSpinner from "../general/ButtonSpinner";

interface props{
  successCallback : ()=>void
}


function AddPropertyForm({successCallback}:props) {
  const { addPropertyForm,
      landlordIdentifier,
      searchItem,
      propertyTypes,
      loading,
      setLoading,
      setPropertyTypes,
      setSearchItem, 
      onSelectChange, 
      setAddPropertyForm,
      setLandlordIdentifier } = usePropertyList();
  const newProperty = useCreateProperty();
  const {data, isLoading, error} = getPropertyTypes();

  useEffect(()=>{
    if(error){
      console.error(error)
      toast.error("Failed to fetch property types", { description: (error as any)?.error || "Something went wrong" });
      return;
    }

    if (data) { setPropertyTypes(data.results ?? []); }
  }, [data, error])
  
  const submitAddPropertyForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();      
    setLoading(true)
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const addresses = extractAddresses(data);
    
    const property = {
      name: data.building_name,
      description: data.property_details,
      status: addPropertyForm.status,
      year_built: parseInt(data.year_built as string),
      total_area: data.total_area,
      is_furnished: addPropertyForm.is_furnished,
      total_number_of_units: parseInt(data.total_number_of_units as string),
      features: {
        parking: addPropertyForm.features.parking,
        security: addPropertyForm.features.security,
        backup_power: addPropertyForm.features.backup_power
      },
      property_type_id: parseInt(addPropertyForm.property_type),
      addresses_input: addresses[0],
      landlords_input: [
        {
          landlord_name: addPropertyForm.landlord_name,
          landlord_type: addPropertyForm.landlord_type,
          landlord_id: addPropertyForm.landlord_id
        }
      ]
    };

    try{
      newProperty.mutate(property, {
        onError: (error: unknown) => {
          if (isAxiosError(error)) {
            console.error("Full backend response:", error.response?.data);
            const errorDetails = error.response?.data?.error || "Unknown error";
            toast.error("Failed to create property", { description: errorDetails });
            return;
          }
          toast.error("Failed to create property. Please try again.");
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("Property successfully created")
          successCallback()
        },
        onSettled: () => setLoading(false),
      });
    } catch (error ){
      console.error(error)
      setLoading(false)
      toast.error("Failed to create property. Internal Error.");
    }
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
              {
                propertyTypes &&
                propertyTypes.map((property_type)=>
                  <SelectItem value={property_type.id.toString()} key={property_type.id}>{property_type.name}</SelectItem>
              
                )
              }
              { 
                !propertyTypes &&
                isLoading &&
                <SelectItem disabled value="loadin" className="text-center flex flex-col justify-center items-center">
                    <LoadingIndicator />
                  </SelectItem>
              }
            </SelectContent>
          </Select>
        </div>
        <div className="form-group">
          <label>Property Details</label>
          <Textarea
            name="property_details"
            placeholder="i.e Rooms, Size,"
          />
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="form-group">
          <label>Total number of units</label>
          <Input
            type="text"
            name="total_number_of_units"
          />
        </div>
        <div className="form-group">
          <label>Building/Complex Name</label>
          <Input
            type="text"
            name="building_name"
          />
        </div>
        <div className="form-group">
          <label>Total Area</label>
           <Input
            type="text"
            name="total_area"
          />
        </div>
        <div className="form-group">
          <label>Year Built</label>
           <Input
            type="text"
            name="year_built"
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
        <fieldset className="border-color relative w-full mb-5 rounded-xl border bg-white/50 p-5 dark:bg-transparent" >
            <legend className="px-4 font-semibold text-zinc-800 dark:text-gray-50"> Features  </legend>
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="parking">Parking</Label>
                  <Select
                    value={addPropertyForm.features.parking}
                    onValueChange={(val) =>
                    setAddPropertyForm((prev) => ({
                      ...prev,
                      features: {
                        ...prev.features, 
                        parking: val,
                      },
                    }))
                  }  >
                  <SelectTrigger id="parking" className="w-full">
                      <SelectValue placeholder="Select parking type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underground">Underground</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="street">Street</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="security">Security</Label>
                  <Select
                    value={addPropertyForm.features.security}
                    onValueChange={(val) =>
                    setAddPropertyForm((prev) => ({
                      ...prev,
                      features: {
                        ...prev.features, 
                        security: val,
                      },
                    }))
                  }
                  >
                    <SelectTrigger id="security" className="w-full">
                      <SelectValue placeholder="Select security level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24/7">24/7</SelectItem>
                      <SelectItem value="daytime">Daytime</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="backup_power">Backup Power</Label>
                  <Select
                    value={addPropertyForm.features.backup_power}
                    onValueChange={(val) =>
                    setAddPropertyForm((prev) => ({
                      ...prev,
                      features: {
                        ...prev.features, 
                        backup_power: val,
                      },
                    }))
                  }
                    >
                    <SelectTrigger id="backup_power" className="w-full">
                      <SelectValue placeholder="Select power backup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generator">Generator</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </fieldset>
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
