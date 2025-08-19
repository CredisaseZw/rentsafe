import {  useRef, useState } from "react";
import AddResidentialInspectionForm from "@/components/forms/AddResidentialInspectionForm";
import AddOfficeInspectionForm from "@/components/forms/AddOfficeInspectionForm";
import AddIndustrialInspectionForm from "@/components/forms/AddIndustrialInspectionForm";
import AddRetailInspectionForm from "@/components/forms/AddRetailInspectionForm";
import AddOtherInspectioForm from "@/components/forms/AddOtherInspectioForm";
import type { InspectionMode } from "@/types";

function useInspections() {
  const months = useRef([
    { key: "jan", label: "January" },
    { key: "feb", label: "February" },
    { key: "mar", label: "March" },
    { key: "apr", label: "April" },
    { key: "may", label: "May" },
    { key: "jun", label: "June" },
    { key: "jul", label: "July" },
    { key: "aug", label: "August" },
    { key: "sep", label: "September" },
    { key: "oct", label: "October" },
    { key: "nov", label: "November" },
    { key: "dec", label: "December" },
  ]);

  const insepctionModes: InspectionMode[] = [
    {
      key: "res",
      label: "Residential",
      Form: AddResidentialInspectionForm,
    },
    {
      key: "office",
      label: "Office",
      Form: AddOfficeInspectionForm,
    },
    {
      key: "industrial",
      label: "Industrail",
      Form: AddIndustrialInspectionForm,
    },
    {
      key: "retail",
      label: "Retail",
      Form: AddRetailInspectionForm,
    },
    {
      key: "other",
      label: "Other",
      Form: AddOtherInspectioForm,
    },
  ];

  const [selectedInspectionMode, setSelectedInspectionMode] = useState<InspectionMode | null>(null);
  const [isModal, setIsModal] = useState(false);

  function getCurrentMonth() {
    const date = new Date();
    const monthIndex = date.getMonth();
    return months.current[monthIndex];
  }

  const onModalClose = () => setIsModal(false);
  const onModalOpen = () => setIsModal(true);

  return {
    isModal,
    onModalClose,
    onModalOpen,
    selectedInspectionMode,
    setSelectedInspectionMode,
    months,
    insepctionModes,
    getCurrentMonth,
  };
}

export default useInspections;
