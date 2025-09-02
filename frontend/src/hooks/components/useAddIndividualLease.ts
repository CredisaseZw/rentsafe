import type { Address, BranchFull, IndividualMinimal } from "@/interfaces";
import { extractTenants, getThreeMonthsBack, normalizeBalance } from "@/lib/utils";
import type { Header, LeasePayload, Option, Property, ShortPropertyData } from "@/types";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router";
import { toast } from "sonner";

function useAddIndividualLease() {
  const inLeaseClientTypes:Option[] = [
    {label : "Individual", value : "individual"},
    {label : "Company", value : "company"},
  ]
  const guarantorTypes:Option[] = [
    {label : "Individual", value : "individual"},
    {label : "company", value : "company_branch"},
  ] 
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
  const unitTypes: Option[] = [
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Office", value: "office" },
    { label: "Retail Space", value: "retail space" },
    { label: "Warehouse", value: "warehouse" },
    { label: "Other", value: "other" }
  ];

  const queryClient = useQueryClient()
  const [loading,setLoading] = useState(false);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [propertyName, setPropertyName] = useState("");
  const [searchItem, setSearchItem] = useState("");  
  const [guaranteeItem, setGuaranteeItem] = useState("");
  const [landlordIdentifier, setLandlordIdentifier] = useState("National ID");
  const [isOpen, setShowModal] = useState(false);
  const [params] = useSearchParams();
  const page = parseInt(params.get("active_page") || "1");
  const [formData, setFormData] = useState({
    guarantor_type : inLeaseClientTypes[0].value,  
    tenant_type : inLeaseClientTypes[0].value,
    landlord_type: inLeaseClientTypes[0].value,

    landlord_id: "" as string | number,
    landlord_name: "",
    effectiveEndDate : "",
  
    address_object : {} as Address,
    property : {} as ShortPropertyData,
    guarantor_id : "" as number | string ,
    guarantor_name : "",
  });
  const [outstandingBalance, setOutstandingBalance] = useState({
      value : "",
      colorCode : "bg-green-500"
  })

  const [tenantsOpeningBalance, setTenantsOpeningBalance] = useState({
    current_month_balance : {
      value : "",
      colorCode : "bg-green-500"
    },
    one_month_back_balance : {
      value : "",
      colorCode : "bg-amber-500"
    },
    two_months_back_balance : {
      value : "",
      colorCode : "bg-rose-500"
    },
    three_months_back_balance : {
      value : "",
      colorCode : "bg-red-500"
    },
    three_months_back_plus_balance : {
      value : "",
      colorCode : "bg-black"
    }
  });

  useEffect(() => {
    const balances = Object.values(tenantsOpeningBalance).map(b => Number(b.value) || 0);
    const maxIndex = balances.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
    const colorCodes = Object.values(tenantsOpeningBalance).map(b => b.colorCode);
    let highestColorCode = colorCodes[maxIndex];
    const totalBalance = balances.reduce((sum, val) => sum + val, 0).toString();

    if (tenantsOpeningBalance.three_months_back_plus_balance.value.length != 0){
      highestColorCode = tenantsOpeningBalance.three_months_back_plus_balance.colorCode
    }

    setOutstandingBalance({
      value: totalBalance,
      colorCode: highestColorCode
    });

  }, [tenantsOpeningBalance]);

  const changeTenantsOpeningBalances = (field: keyof typeof tenantsOpeningBalance, value: string) => {
    setTenantsOpeningBalance((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }));
  };


  useEffect(()=>{
    setTimeout(()=> 
      setHeaders([
        { name: "Payment Data" },
        { name: "More than 3 months" },
        ...getThreeMonthsBack(formData.effectiveEndDate).map((h) => ({ name: h })),
        { name: "Outstanding Balance" }
    ]), 500)
  }, [formData.effectiveEndDate])
 
  const handleUpdateForm = (name:any, value:any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const onSelectGuarantor = (item: IndividualMinimal | BranchFull)=>{
    if ("first_name" in item) {
      setFormData((prev) => ({
        ...prev,
        guarantor_id: item.id,
        guarantor_name: `${item.first_name} ${item.last_name}`,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      guarantor_id: item.company.id,
      guarantor_name: item.company.registration_name,
    }));
    return
  }


  const onSelectLandlord = (item: IndividualMinimal | BranchFull)=>{
    if ("first_name" in item) {
      setFormData((prev) => ({
      ...prev,
      landlord_id: item.id,
      landlord_name: `${item.first_name} ${item.last_name}`,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      landlord_id: item.company.id,
      landlord_name: item.company.registration_name,
    }));
    return
  }

  const onSelectProperty = (item: Property) => {
    setFormData((p) => ({
      ...p,
      property: {
        id: item.id ?? "",
        name: item.name ?? "",
        description: item.description ?? "",
        status: item.status ?? "",
        total_number_of_units: item.total_number_of_units ?? 0,
        property_type_name: item.property_type ?? "",
        total_area : 0
      },
      address_object: Array.isArray(item.full_address) && item.full_address.length > 0
        ? item.full_address[0]
        : ({} as Address)
    }));
  }

 const handleLeaseSubmit = (useMutate: UseMutationResult<any, Error, any, unknown>,e: React.FormEvent<HTMLFormElement>, clientType: string, successCallback : ()=> void) => {
  e.preventDefault();
  setLoading(true);
  const FORM_DATA = new FormData(e.currentTarget);
  const data = Object.fromEntries(FORM_DATA.entries());
  const tenants = extractTenants(data, clientType);

  const PAYLOAD: LeasePayload = {
    start_date: String(data.leaseStartDate),
    end_date: String(data.leaseEndDate),
    signed_date: String(new Date().toISOString().split("T")[0]),
    status: String(data.leaseStatus) as LeasePayload["status"],
    currency: Number(data.currencyType),
    payment_frequency: String(data.paymentFrequency) as LeasePayload["payment_frequency"],
    due_day_of_month: Number(data.effectiveStartDate),
    grace_period_days: Number(formData.effectiveEndDate),
    is_rent_variable: data.rentVariable === "true",
    includes_utilities: data.otherStandingCharging?.toString().trim().length > 0,
    property_data: formData.property,
    unit_data: {
      unit_number: String(data.unitNumber),
      unit_type: String(data.unitType) as LeasePayload["unit_data"]["unit_type"],
      number_of_rooms: Number(data.unitNumberOfRooms),
    },
    address_data: {
        street_address: formData.address_object.street_address ?? "",
        suburb_id: formData.address_object.suburb?.id || 0,
        postal_code: formData.address_object.postal_code ?? ""
    },
    landlord_data: {
      landlord_type: String(formData.landlord_type) as LeasePayload["landlord_data"]["landlord_type"],
      landlord_name: String(formData.landlord_name),
      landlord_id: Number(formData.landlord_id)
    },
    guarantor_data: {
      guarantor_type: String(formData.guarantor_type) as LeasePayload["guarantor_data"]["guarantor_type"],
      guarantor_id: Number(formData.guarantor_id),
      guarantee_amount: String(data.rentGuaranteeAmount)
    },
    tenants : tenants,
    charges: [
      {
        charge_type: "RENT",
        description: "Monthly Rent",
        amount: String(data.monthlyRent),
        currency: Number(data.currencyType),
        frequency: String(data.paymentFrequency) as LeasePayload["charges"][0]["frequency"],
        effective_date: String(data.leaseStartDate),
        end_date: String(data.leaseEndDate),
        vat_inclusive: data.vatInclusive === "true"
      },
       {
        charge_type: "UTILITY",
        description: "Utility Charge",
        amount: String(data.otherStandingCharging),
        currency: Number(data.currencyType),
        frequency: String(data.paymentFrequency) as LeasePayload["charges"][0]["frequency"],
        effective_date: String(data.leaseStartDate),
        end_date: String(data.leaseEndDate),
        vat_inclusive: data.vatInclusive === "true"
      }
    ],
    deposits: [
      {
        amount: Number(data.depositAmount),
        currency: Number(data.depositCurrency),
        deposit_date: String(data.depositDate),
        deposit_holder: String(data.depositHolder) as LeasePayload["deposits"][0]["deposit_holder"]
      }
    ],
    lease_opening_balance_data: {
      current_month_balance: normalizeBalance(data.current_month_balance),
      one_month_back_balance: normalizeBalance(data.one_month_back_balance),
      two_months_back_balance: normalizeBalance(data.two_months_back_balance),
      three_months_back_balance: normalizeBalance(data.three_months_back_balance),
      three_months_plus_balance: normalizeBalance(data.paymentDataMoreThan3Months),
      outstanding_balance: String(outstandingBalance.value)
    },
    landlord_opening_balances_data: [
      {
        amount: String(data.landlordsOpeningBalance),
        commission_percentage: String(data.commissionPercentage),
        operating_costs_inclusive: data.operatingCostsIncluded === "true"
      }
    ]
  };

  console.log("Final Data: ", PAYLOAD)

  useMutate.mutate(PAYLOAD, {
    onError: (error: AxiosError |Error | unknown) => {
      if (isAxiosError(error)) {
        console.error("Full backend response:", error.response?.data);
        const errorDetails = error.response?.data?.error || error.response?.data?.detail || "Something went wrong";
        toast.error("Failed to create new lease", { description: errorDetails });
        return;
        }
      toast.error("Failed to create property. Please try again.");
    },
    onSuccess :() => {
      toast.success("Lease successfully created")
      queryClient.invalidateQueries({ queryKey: ["leases", page, "ACTIVE"] });
      successCallback()
    }, 
    onSettled: () => setLoading(false),         
  })
};

  return {
    isOpen,
    headers,
    loading,
    formData,
    unitTypes,
    searchItem,
    propertyName,
    guarantorTypes,
    guaranteeItem,
    statusOptions,
    currencyOptions, 
    inLeaseClientTypes,
    leaseStatusOptions,
    outstandingBalance,
    landlordIdentifier,
    depositHolderOptions,
    tenantsOpeningBalance,
    paymentFrequencyOptions, 
    changeTenantsOpeningBalances,
    setTenantsOpeningBalance,
    setLandlordIdentifier,
    onSelectGuarantor,
    handleLeaseSubmit,
    setGuaranteeItem,
    handleUpdateForm,
    onSelectLandlord,
    onSelectProperty,
    setPropertyName,
    setSearchItem,
    setShowModal,
    setFormData,
  }
}

export default useAddIndividualLease