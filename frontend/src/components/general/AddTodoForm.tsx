import React from 'react'

function AddTodoForm() {
  return (
    <div>
        <div className=''>
            <h2 className='font-bold'>Add To-Do Item</h2>
            <form action="" className='w-full mt-5' method='post'>
                <div className='form-group'>
                    <label htmlFor='details' className='mb-2 text-gray-800'>Item details</label>
                    <textarea
                        autoFocus
                        className="input-default w-full"
                        id='details'
                        name = "item_details">     
                    </textarea>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="" className='mb-2 text-gray-800'>Balance Owing</label>
                     <div className='flex flex-row select-input'>
                        <select name="currency" id="currency" >
                            <option value="ZWG">ZWG</option>
                            <option value="USD">USD</option>
                        </select>
                        <input
                            type='number'
                            id='balance'
                            name='balancing_owing'
                            className=''
                        />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row'>
                    <div className="w-full md:w-1/2">
                        <div className='form-group'>
                            <label htmlFor="">Date</label>
                            <input type="date" name='date' id='date' className='input-default' />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="form-group">
                            <label htmlFor="">Function</label>
                            <select>
                                <option value="">Landlord</option>
                                <option value="">Work</option>
                                <option value=""></option>
                                <option value="">Tenant</option>

                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddTodoForm