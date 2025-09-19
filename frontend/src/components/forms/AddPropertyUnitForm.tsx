import { UNIT_STATUS, UNIT_TYPES } from '@/constants'
import ColumnsContainer from '../general/ColumnsContainer'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type { Option } from '@/types'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import useProperty from '@/hooks/components/useProperty'
import useAddUnit from '@/hooks/apiHooks/useAddUnit'
import ButtonSpinner from '../general/ButtonSpinner'
import { validateAmounts } from '@/lib/utils'
import SelectFeatures from '../general/SelectFeatures'

interface props{
    onSuccessCallback : ()=> void;
}
function AddPropertyUnitForm({onSuccessCallback} : props) {
    const {
        property_id,
        loading,
        selectedList,
        setSelectedList,
        handleAddUnit,
    } = useProperty()
    const UNIT = useAddUnit(property_id)

    return (
        <form className='mt-5' onSubmit={(e)=> handleAddUnit(UNIT, e, onSuccessCallback)}>
            <div className="form-group">
                <Label className="px-2 font-normal required" htmlFor="rentGuarantorName">
                    Unit Number
                </Label>
                <Input
                    required
                    name={`unitNumber`}
                    id="unitNumber"
                />
            </div>
            <ColumnsContainer numberOfCols={3}>
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
                <div className="form-group">
                    <Label className="px-2 font-normal" htmlFor="rentGuarantorName">
                        Status
                    </Label>
                    <Select
                        defaultValue={UNIT_STATUS[0].value}
                        required
                        name="status">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                UNIT_STATUS.length &&
                                UNIT_STATUS.map((u:Option, index: number )=>
                                    <SelectItem value={u.value} key={index}>{u.label}</SelectItem>
                                )
                            }

                        </SelectContent>
                    </Select>
                </div>
                <div className="form-group">
                    <Label className="px-2 font-normal required" htmlFor="rentGuarantorName">
                        Number of Rooms 
                    </Label>
                    <Input
                        required
                        name={`numberOfRooms`}
                        id="numberOfRooms"
                        type= "number"
                        onWheel={(e) => {(e.target as HTMLInputElement).blur()}}
                        onKeyDown={validateAmounts}
                    />
                </div>
            </ColumnsContainer>
            <div className='mt-5'>
                <SelectFeatures
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                />
            </div>
            <div className='mt-3 flex flex-row justify-end'>
                <Button type='submit' disabled={loading} className='flex flex-row gap-2'>
                    {
                        loading ?
                        <ButtonSpinner/> :
                        <Send/>
                    }
                    Save Unit
                </Button>
            </div>
        </form>
    )
}

export default AddPropertyUnitForm