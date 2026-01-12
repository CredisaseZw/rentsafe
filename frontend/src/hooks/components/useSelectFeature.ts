import { UNIT_FEATURES } from "@/constants";
import type { SelectedFeature } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  selectedList: SelectedFeature[]
  setSelectedList: Dispatch<SetStateAction<SelectedFeature[]>>
}
function useSelectFeature({selectedList, setSelectedList}: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedFeature, setSelectedFeature] = useState<string>("")
   

    const currentCategory = UNIT_FEATURES.find(
        (cat) => cat.value === selectedCategory
    )
    const handleAdd = () => {
        if (selectedCategory && selectedFeature) {
            const isDuplicate = selectedList.some(
                (item) => item.category === selectedCategory && item.feature === selectedFeature
            )
            if (isDuplicate) return toast.info("Feature already selected")
            setSelectedList((prev) => [
                ...prev,
                { category: selectedCategory, feature: selectedFeature },
            ])
            setSelectedFeature("") 
        }
    }

    return {
        selectedCategory,
        selectedFeature,
        selectedList,
        currentCategory,
        handleAdd,
        setSelectedFeature,
        setSelectedCategory,
    }
}

export default useSelectFeature