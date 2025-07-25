import useContractorManagement from "@/hooks/components/useContractorManagement";
import Button from "../general/Button";
import { Plus } from "lucide-react";
import Spinner from "../general/Spinner";

function AddContractorForm() {
   const { contractor, isLoading, uploadContractorHandler, onChangeHandler } = useContractorManagement();

   return (
      <div className="w-full">
         <form method="POST" onSubmit={uploadContractorHandler}>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
               <div className="form-group">
                  <label htmlFor="">Contractor Industry</label>
                  <select
                     onChange={onChangeHandler}
                     value={contractor.contractorIndustry}
                     className="input-default"
                     name="contractorIndustry"
                  >
                     <option value="">Select Industry</option>
                     <option value="Electrician">Electrician</option>
                     <option value="Plumber">Plumber</option>
                     <option value="Landscaping">Landscaping</option>
                     <option value="Carpenter">Carpenter</option>
                     <option value="Pool">Pool</option>
                     <option value="General Contractor">General Contractor</option>
                     <option value="HVAC">HVAC</option>
                     <option value="Inspectors">Inspectors</option>
                     <option value="Interior Decorator">Interior Decorator</option>
                     <option value="Tilers">Tilers</option>
                     <option value="Refrigeration">Refrigeration</option>
                     <option value="Roofing contractor">Roofing contractor</option>
                     <option value="Fire Protection / Sprinklers">Fire Protection / Sprinklers</option>
                     <option value="Security">Security</option>
                     <option value="Telecoms">Telecoms</option>
                     <option value="Flooring">Flooring</option>
                     <option value="Waste Management">Waste Management</option>
                     <option value="Water providers">Water providers</option>
                     <option value="Walling / Fencing">Walling / Fencing</option>
                     <option value="Paving">Paving</option>
                     <option value="Gas">Gas</option>
                     <option value="Dry Walling">Dry Walling</option>
                     <option value="Other">Other</option>
                     <option value="Builders">Builders</option>
                     <option value="Windows">Windows</option>
                  </select>
               </div>
               <div className="form-group">
                  <label htmlFor="">ID / Reg #</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.ID_REG}
                     className="input-default"
                     name="ID_REG"
                     placeholder="ID / Reg number"
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="" className="required">
                     Name
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.name}
                     className="input-default"
                     name="name"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="requirefd">
                     Mobile Number
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.mobileNumber}
                     className="input-default"
                     name="mobileNumber"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Telephone Number</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.telephoneNumber}
                     className="input-default"
                     name="telephoneNumber"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Email</label>
                  <input
                     type="email"
                     onChange={onChangeHandler}
                     value={contractor.email}
                     className="input-default"
                     name="email"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Contact Person</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.contactPerson}
                     className="input-default"
                     name="contactPerson"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Contact's Mobile Number</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.contactMobileNumber}
                     className="input-default"
                     name="contactMobileNumber"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Contact's Email</label>
                  <input
                     type="email"
                     onChange={onChangeHandler}
                     value={contractor.contactEmail}
                     className="input-default"
                     name="contactEmail"
                  />
               </div>
            </div>
            <div className="mt-8 mb-8 w-full bg-blue-100 p-3 text-center">
               <span className="font-semibold text-blue-700">Contractor Address</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
               <div className="form-group">
                  <label htmlFor="" className="required">
                     Property Type
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.propertyType}
                     className="input-default"
                     name="propertyType"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">No. of rooms</label>
                  <input
                     type="number"
                     onChange={onChangeHandler}
                     value={contractor.noOfRooms}
                     className="input-default"
                     name="noOfRooms"
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="">Unit Number</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.unitNumber}
                     className="input-default"
                     name="unitNumber"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Building / Complex Name</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.buildingName}
                     className="input-default"
                     name="buildingName"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="required">
                     Street Number
                  </label>
                  <input
                     type="number"
                     required
                     onChange={onChangeHandler}
                     value={contractor.streetNumber}
                     className="input-default"
                     name="streetNumber"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="required">
                     Street Name
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.streetName}
                     className="input-default"
                     name="streetName"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="required">
                     Suburb/Area
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.suburb}
                     className="input-default"
                     name="suburb"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="required">
                     City / Town
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.city}
                     className="input-default"
                     name="city"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Province</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.province}
                     className="input-default"
                     name="province"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="" className="required">
                     Country
                  </label>
                  <input
                     type="text"
                     required
                     onChange={onChangeHandler}
                     value={contractor.country}
                     className="input-default"
                     name="country"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Area Code</label>
                  <input
                     type="number"
                     onChange={onChangeHandler}
                     value={contractor.areaCode}
                     className="input-default"
                     name="areaCode"
                  />
               </div>
            </div>
            <div className="form-group mt-4">
               <label htmlFor="">Other Property Details</label>
               <textarea
                  placeholder="Other property details..."
                  onChange={onChangeHandler}
                  value={contractor.otherPropertyDetails}
                  className="input-default"
                  name="otherPropertyDetails"
               />
            </div>
            <div className="mt-8 mb-8 w-full bg-blue-100 p-3 text-center">
               <span className="font-semibold text-blue-700">Contractor Details</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
               <div className="form-group">
                  <label htmlFor="">Charge Currency</label>
                  <select
                     onChange={onChangeHandler}
                     value={contractor.chargeCurrency}
                     className="input-default"
                     name="contractorIndustry"
                  >
                     <option value="">USD</option>
                     <option value="">ZIG</option>
                  </select>
               </div>
               <div className="form-group">
                  <label htmlFor="">Standard Rate</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.standardRate}
                     className="input-default"
                     name="standardRate"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">Emergency Rate</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.emergencryRate}
                     className="input-default"
                     name="emergencryRate"
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="">License Number</label>
                  <input
                     type="text"
                     onChange={onChangeHandler}
                     value={contractor.licenseNumber}
                     className="input-default"
                     name="licenseNumber"
                  />
               </div>
            </div>
            <div className="mt-5 flex w-full justify-end">
               <Button type={"submit"} disabled={isLoading} className="bg-PRIMARY flex flex-row gap-3">
                  {isLoading ? <Spinner /> : <Plus size={18} className="self-center" />}
                  <span>Submit</span>
               </Button>
            </div>
         </form>
      </div>
   );
}

export default AddContractorForm;
