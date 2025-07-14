import React from 'react'
import Button from './Button'
import { Plus } from 'lucide-react'

function AddPropertyForm() {
  return (
   <form>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='form-group'>
                <label htmlFor="" className='required'>Property Type</label>
                <select required name="property_type" className='input-default' id="">
                    <option value="" disabled>Select .. </option>
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
                <input type="text" className='input-default' placeholder='i.e Rooms, Size,'/>
            </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-5'>
            <div className="form-group">
                <label htmlFor="">Unit Number</label>
                <input type="text" className='input-default' name='unit_number' />
            </div>
            <div className="form-group">
                <label htmlFor="">Building/Complex Name</label>
                <input type="text" className='input-default' name='building_name' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Street Number</label>
                <input type="text" required className='input-default' name='street_number' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Street Name</label>
                <input type="text" required className='input-default' name='street_name' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>Suburb/Area</label>
                <input type="text" required className='input-default' name='area' />
            </div>
            <div className="form-group">
                <label htmlFor="" className='required'>City/Town</label>
                <input type="text" required className='input-default' name='city_town' />
            </div> 
            <div className="form-group">
                <label htmlFor="">Province</label>
                <input type="text" className='input-default' name='province' />
                </div>
            <div className="form-group">
                <label htmlFor="">Country</label>
                <input type="text" className='input-default' name='country' /> 
            </div>        
            <div className="form-group">
                <label htmlFor="">Area Code</label>
                <input type="text" className='input-default' name='country' /> 
            </div>            
        </div>
        <div className='bg-blue-100 text-center w-full p-3 mt-8 mb-8'><span className='font-semibold text-blue-700'>Landlord</span></div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className="form-group">
                <label htmlFor="">Landlord type</label>
                <select name="lanlord_type" className='input-default' id="">
                    <option value="" disabled>Select .. </option>
                    <option value="Indiividual">Individual</option>
                    <option value="Company">Company</option>
                </select>
            </div>     
            <div className="form-group">
                <label htmlFor="" className='required'>ID/Reg#</label>
                <input type="text" required className='input-default' name='country' /> 
            </div>     
            <div className="form-group">
                <label htmlFor="" className='required'>Landlord Name</label>
                <input type="text" required className='input-default' name='country' /> 
            </div>     
        </div>
        <div className='flex w-full justify-end mt-5'>
            <Button className='bg-PRIMARY flex flex-row gap-3'>
                <Plus size={18} className='self-center'/>
                <span>Submit</span>
            </Button>
        </div>
    </form>  
  )
}

export default AddPropertyForm