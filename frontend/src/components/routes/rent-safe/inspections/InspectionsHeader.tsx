import Searchbox from "@/components/general/Searchbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/general/Modal";
import useInspections from "@/hooks/components/useInspections";

function InspectionsHeader() {
  const {
    months,
    isModal,
    insepctionModes,
    selectedInspectionMode,
    setSelectedInspectionMode,
    getCurrentMonth,
    onModalClose,
    onModalOpen,
  } = useInspections();

  const SelectedForm = selectedInspectionMode?.Form;

  return (
    <div>
        {
            isModal &&
            <Modal
                onClose={onModalClose}
                modalHeader={`Property Inspection Checklist - ${selectedInspectionMode?.label}`}
                size="xl"
            >
                {SelectedForm && <SelectedForm />}
            </Modal>
        }
    
      <div className="flex flex-row justify-between gap-4">
        <div className="self-center">
            <Select value={getCurrentMonth().key}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={getCurrentMonth().label} />
            </SelectTrigger>
            <SelectContent>
                {months.current.map(({ key, label }) => (
                <SelectItem key={key} value={key}>
                    {label}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        
        <Searchbox
          placeholder="Landlord, address, property, type"
          handleSearch={() => {}}
        />
        <div>
            <p className="text-center text-gray-800 dark:text-white text-sm mb-1">New Inspection</p>
            <Select
                onValueChange={(key) => {
                    const mode = insepctionModes.find((m) => m.key === key);
                    if (mode) {
                    setSelectedInspectionMode(mode);
                    onModalOpen(); 
                    }
                }}
                >
                <SelectTrigger className="w-[220px]">
                    <SelectValue
                    placeholder={
                        selectedInspectionMode
                        ? "New Inspection"
                        : "Select Inspection Type"
                    }
                    />
                </SelectTrigger>
                <SelectContent>
                    {insepctionModes.map(({ key, label }) => (
                    <SelectItem key={key} value={key}>
                        {label}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  );
}

export default InspectionsHeader;
