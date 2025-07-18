import React from 'react'
import Button from './Button'
import { Plus } from 'lucide-react'
import usePropertyList from '@/hooks/components/usePropertyList'

function AddPropertyForm() {
    let {addPropertyForm, onChangeHandler, submitAddPropertyForm} = usePropertyList();

  return (
   <form onSubmit={submitAddPropertyForm} method='post'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='form-group'>
                <label htmlFor="" className='required'>Property Type</label>
                <select onChange={onChangeHandler} value={addPropertyForm.property_type} required name="property_type" className='input-default' id="">
                    <option value="" disabled>Select ... </option>
                    <option value="Residental House">Residental - House</option>
                    <option value="Residental Cottage">Residental - Cottage</option>
                    <option value="Residental Townhouse">Residental - Townhouse</option>
                    <option value="Residental Flats">Residental - Flats</option>
                    <option value="Residental Small Holdings">Residental - Small Holdings</option>
                    <option value="Commercial Offices">Commercial - Offices</option>
                    <option value="Commercial Industrial">Commercial - Industrial</option>
                    <option value="Commercial Hospitality">Commercial - Hospitality</option>
                    <option value="Agricultural Plot">Agricultural - Plot</option>
                    <option value="Agricultural Small Farm">Agricultural - Small Farm</option>
                    <option value="Agricultural Commercial Farm">Agricultural - Commercial Farm</option>
                    <option value="Land Undeveloped">Land - Undeveloped</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="">Property Details</label>
                <input type="text" onChange={onChangeHandler} value={addPropertyForm.property_details} className='input-default' name='property_details' placeholder='i.e Rooms, Size,'/>
            </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-5'>
            <div className="form-group">
                <label htmlFor="">Unit Number</label>
                <input type="text" onChange={onChangeHandler} value={addPropertyForm.unit_number} className='input-default' name='unit_number' />
            </div>
            <div className="form-group">
                <label htmlFor="">Building/Complex Name</label>
                <input type="text" onChange={onChangeHandler} value={addPropertyForm.building_name} className='input-default' name='building_name' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Street Number</label>
                <input type="text" required onChange={onChangeHandler} value={addPropertyForm.street_number} className='input-default' name='street_number' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Street Name</label>
                <input type="text" required className='input-default' onChange={onChangeHandler} value={addPropertyForm.street_name} name='street_name' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Suburb/Area</label>
                <input type="text" required className='input-default' name='area' onChange={onChangeHandler} value={addPropertyForm.area}/>
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>City/Town</label>
                <input type="text" required className='input-default' onChange={onChangeHandler} value={addPropertyForm.city_town} name='city_town' />
            </div> 
            <div className="form-group">
                <label htmlFor="">Province</label>
                <input type="text" className='input-default' onChange={onChangeHandler} value={addPropertyForm.province} name='province' />
                </div>
            <div className="form-group">
                <label htmlFor="">Country</label>
                <input type="text" className='input-default' name='country' onChange={onChangeHandler} value={addPropertyForm.country} /> 
            </div>        
            <div className="form-group">
                <label htmlFor="">Area Code</label>
                <input type="text" className='input-default' onChange={onChangeHandler} value={addPropertyForm.area_code} name='area_code' /> 
            </div>            
        </div>
        <div className='bg-blue-100 text-center w-full p-3 mt-8 mb-8'><span className='font-semibold text-blue-700'>Landlord</span></div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className="form-group">
                <label htmlFor="">Landlord type</label>
                <select name="lanlord_type" onChange={onChangeHandler} value={addPropertyForm.lanlord_type} className='input-default' id="">
                    <option value="" disabled>Select .. </option>
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                </select>
            </div>     
            <div className="form-group">
                <label htmlFor="" className='required'>ID/Reg#</label>
                <input type="text" required className='input-default' onChange={onChangeHandler} value={addPropertyForm.landlord_id} name='landlord_id' /> 
            </div>     
            <div className="form-group">
                <label htmlFor="" className='required'>Landlord Name</label>
                <input type="text" required onChange={onChangeHandler} value={addPropertyForm.landlord_name} className='input-default' name='landlord_name' /> 
            </div>     
        </div>
        <div className='flex w-full justify-end mt-5'>
            <Button type={"submit"} className='bg-PRIMARY flex flex-row gap-3'>
                <Plus size={18} className='self-center'/>
                <span>Submit</span>
            </Button>
        </div>
    </form>  
  )
}

export default AddPropertyForm