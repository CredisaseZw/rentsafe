import type { Address, CompanyMinimal, IndividualMinimal } from "@/interfaces";
import { getThreeMonthsBack } from "@/lib/utils";
import type { Header, Option, Property, PropertyType } from "@/types";
import { useEffect, useState } from "react"

function useAddIndividualLease() {
  const currencyOptions:Option[] = [
    {label : "US", value : "1"}, // UPDATE AFTER CURRENCY MANAGEMENT WORKS
    {label : "ZWG", value : "2"}
  ]
  const statusOptions:Option[] = [
    {label : "Occupied", value : "occupied"},
    {label : "Vacant", value : "vacant"}
  ]
  const leaseStatusOptions: Option[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Terminated", value: "TERMINATED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Renewed", value: "RENEWED" },
  { label: "Suspended", value: "SUSPENDED" },
];
  const paymentFrequencyOptions: Option[] = [
    { label: "Monthly", value: "MONTHLY" },
    { label: "Quarterly", value: "QUARTERLY" },
    { label: "Annually", value: "ANNUALLY" },
  ];

  const depositHolderOptions:Option[] = [
    {label : "Agent", value : "agent"},
    {label : "Landlord", value: "landlord"}
  ]
  const [headers, setHeaders] = useState<Header[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [propertyName, setPropertyName] = useState("");
  const [searchItem, setSearchItem] = useState("");  
  const [landlordIdentifier, setLandlordIdentifier] = useState("National ID");
  const [isOpen, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tenant_type : "individual",
    landlord_type: "individual",
    landlord_id: "",
    landlord_name: "",
    effectiveEndDate : "",
    address_object : {} as Address,

    operatingCostsIncluded: false
  });

  const [tenantsOpeningBalance, setTenantsOpeningBalance] = useState({
    current_month_balance : "",
    one_month_back_balance : "",
    two_months_back_balance : "",  
    three_months_back_balance : "",
    three_months_back_plus_balance : "",
    outstanding_balance : ""
  })

  useEffect(()=>{
    setHeaders([
      { name: "Payment Data" },
      { name: "More than 3 months" },
      ...getThreeMonthsBack(formData.effectiveEndDate).map((h) => ({ name: h })),
      { name: "Outstanding Balance" }
    ])
  }, [formData.effectiveEndDate])
 
  const handleUpdateForm = (name:any, value:any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSelectLeaseNameValue = (item : IndividualMinimal | CompanyMinimal) => {
      if ("first_name" in item) {
        setFormData((p)=> ({...p, 
          tenant_id: item.id,
          tenant_name: `${item.first_name} ${item.last_name}`,
          //tenant_mobile : item.contact_details?.mobile_phone?[0] || ""
        }))
      }
  }
  
  const onSelectLandlord = (item: IndividualMinimal | CompanyMinimal)=>{
    if ("first_name" in item) {
      setFormData((prev) => ({
      ...prev,
      landlord_id: item.identification_number,
      landlord_name: `${item.first_name} ${item.last_name}`,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      landlord_id: item.registration_number,
      landlord_name: item.registration_name,
    }));
    return
  }

  const onSelectProperty = (item: Property) =>{
    console.log(item)
  }

  return {
    isOpen,
    headers,
    formData,
    searchItem,
    propertyName,
    propertyTypes,
    statusOptions,
    currencyOptions, 
    leaseStatusOptions,
    landlordIdentifier,
    depositHolderOptions,
    tenantsOpeningBalance,
    paymentFrequencyOptions, 
    setTenantsOpeningBalance,
    onSelectProperty,
    setPropertyTypes,
    setPropertyName,
    onSelectLeaseNameValue,
    onSelectLandlord,
    setLandlordIdentifier,
    setSearchItem,
    setFormData,
    handleUpdateForm,
    setShowModal
  }
}

export default useAddIndividualLease