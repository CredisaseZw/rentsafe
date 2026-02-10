import useSelectFeature from '@/hooks/components/useSelectFeature'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Fieldset from './Fieldset'
import ColumnsContainer from './ColumnsContainer'
import { UNIT_FEATURES } from '@/constants'
import { Button } from '../ui/button'
import type { SelectedFeature } from '@/types'
import type { Dispatch, SetStateAction } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  selectedList: SelectedFeature[]
  setSelectedList: Dispatch<SetStateAction<SelectedFeature[]>>
}
function SelectFeatures({selectedList, setSelectedList}: Props) {
    const {
        selectedCategory,
        selectedFeature,
        currentCategory,
        handleAdd,
        setSelectedFeature,
        setSelectedCategory,
    } = useSelectFeature({selectedList, setSelectedList})
  return (
      <Fieldset legendTitle='Unit Features'>
        <ColumnsContainer marginClass='mt-0' numberOfCols={3}>
            <Select
                value={selectedCategory}
                onValueChange={(val) => {
                setSelectedCategory(val)
                setSelectedFeature("") }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Feature Categories" />
                </SelectTrigger>
                <SelectContent>
                    {UNIT_FEATURES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            <Select
                value={selectedFeature}
                onValueChange={(val) => setSelectedFeature(val)}
                disabled={!selectedCategory}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Feature Selection" />
                </SelectTrigger>
                <SelectContent>
                    {currentCategory?.subOptions &&
                    currentCategory?.subOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleAdd} variant={"outline"} type='button' disabled={!selectedFeature}><Plus/> Add More Features</Button>
        </ColumnsContainer>
        <div className="mt-4 border border-color rounded-md p-3 space-y-2">
            <h4 className="font-semibold text-gray-600 dark:text-white">Selected Features</h4>
            {selectedList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No features added yet</p>
            ) : (
            <ul className="space-y-1">
                {selectedList.map((item, idx) => {
                    const catLabel =
                    UNIT_FEATURES.find((c) => c.value === item.category)?.label ??
                    item.category
                    const featLabel =
                    UNIT_FEATURES.find((c) => c.value === item.category)
                    ?.subOptions?.find((f) => f.value === item.feature)
                    ?.label ?? item.feature
                    return (
                        <li key={idx} className='text-gray-800 text-sm dark:text-white'>
                        {catLabel} → <span className="font-medium text-gray-800 text-sm dark:text-white">{featLabel}</span>
                        </li>
                    )
                })}
            </ul>
            )}
        </div> 
    </Fieldset>
  )
}

export default SelectFeatures