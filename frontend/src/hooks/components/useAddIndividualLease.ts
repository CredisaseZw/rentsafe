import { IN_LEASE_CLIENT_TYPES } from "@/constants";
import type { Address, BranchFull, IndividualMinimal } from "@/interfaces";
import { extractTenants, getThreeMonthsBack, validateBalances } from "@/lib/utils";
import type {Currency, LeasePayload, Property, PropertyType, ShortPropertyData } from "@/types";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";
import { toast } from "sonner";

function useAddIndividualLease() {
  const queryClient = useQueryClient()
  const [manualLogProperty, setManualLogProperty] = useState(false);
  const [loading,setLoading] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [searchItem, setSearchItem] = useState("");  
  const [CURRENCY_OPTIONS, SET_CURRENCY_OPTIONS] = useState<Currency[]>([]);
  const [guaranteeItem, setGuaranteeItem] = useState("");
  const [propertyType, setPropertyTypes] = useState<PropertyType[]>([])
  const [landlordIdentifier, setLandlordIdentifier] = useState("National ID");
  const [isOpen, setShowModal] = useState(false);
  const [primaryTenantAddress , setPrimaryTenantAddress] = useState<Address | undefined>(undefined);

  const [params] = useSearchParams();
  const page = parseInt(params.get("active_page") || "1");

  const [formData, setFormData] = useState({
    tenant_type : IN_LEASE_CLIENT_TYPES[0].value,
    landlord_type: IN_LEASE_CLIENT_TYPES[0].value,

    landlord_id: "" as string | number,
    landlord_name: "",
    effectiveEndDate : "7",

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
    const entries = [
      tenantsOpeningBalance.current_month_balance,
      tenantsOpeningBalance.one_month_back_balance,
      tenantsOpeningBalance.two_months_back_balance,
      tenantsOpeningBalance.three_months_back_balance,
      tenantsOpeningBalance.three_months_back_plus_balance,
    ];

    let highestColorCode = entries[0].colorCode;

    if (Number(entries[4].value) > 0) {
      highestColorCode = entries[4].colorCode;
    } else if (Number(entries[3].value) > 0) {
      highestColorCode = entries[3].colorCode;
    } else if (Number(entries[2].value) > 0) {
      highestColorCode = entries[2].colorCode;
    } else if (Number(entries[1].value) > 0) {
      highestColorCode = entries[1].colorCode;
    }

    const totalBalance = entries
      .map(b => Number(b.value) || 0)
      .reduce((sum, val) => sum + val, 0)
      .toString();

    setOutstandingBalance({
      value: totalBalance,
      colorCode: highestColorCode,
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
  const headers = useMemo(() => ([
    { name: "Payment Data" },
    { name: "More than 3 months" },
    ...getThreeMonthsBack(formData.effectiveEndDate).map(h => ({ name: h })),
    { name: "Outstanding Balance" }
  ]), [formData.effectiveEndDate]);
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
        property_type_name:  typeof item.property_type === "string"
        ? item.property_type
        : item.property_type?.name ?? "",
        total_area : 0
      },
      address_object: Array.isArray(item.full_address) && item.full_address.length > 0
      ?  item.full_address[0]
      : ({} as Address)
    }));
  }
  const switchToPropertyContext = () => {
    const newState = !manualLogProperty;
    if(primaryTenantAddress === undefined && newState) return toast.error("Add a primary tenant", {description :"Insert a valid primary Tenant"})
    setManualLogProperty(newState);
  }

  const handleLeaseSubmit = (useMutate: UseMutationResult<any, Error, any, unknown>,e: React.FormEvent<HTMLFormElement>, clientType: string, successCallback : ()=> void) => {
    e.preventDefault();
    setLoading(true);
    const FORM_DATA = new FormData(e.currentTarget);
    const data = Object.fromEntries(FORM_DATA.entries());
    const tenants = extractTenants(data, clientType);

    const source =
    manualLogProperty && primaryTenantAddress !== undefined
      ? primaryTenantAddress
      : formData.address_object;

    const propertyData: ShortPropertyData =  
    manualLogProperty && primaryTenantAddress !== undefined
    ? {
      name : String(data.propertyName),
      property_type_name : String(data.propertyTypeName),
      description : String(data.propertyDetails),
      status : String("active")
    } :  formData.property

    const lease_opening_balance_data = {
        current_month_balance: Number(data.current_month_balance),
        one_month_back_balance: Number(data.one_month_back_balance),
        two_months_back_balance: Number(data.two_months_back_balance),
        three_months_back_balance: Number(data.three_months_back_balance),
        three_months_plus_balance: Number(data.paymentDataMoreThan3Months),
        outstanding_balance: Number(outstandingBalance.value)
    }

    const { valid, message } = validateBalances(lease_opening_balance_data);
    if (!valid) {
      toast.error("Lease opening balances not valid", { description: message });
      return setLoading(false)
    }

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
      property_data: propertyData,
      unit_data: {
        unit_number: String(data.unitNumber),
        unit_type: String(data.unitType) as LeasePayload["unit_data"]["unit_type"],
        number_of_rooms: Number(data.unitNumberOfRooms),
      },
      address_data: {
        street_address: source?.street_address ?? "",
        suburb_id: source?.suburb?.id || 0,
        postal_code: source?.postal_code ?? ""
      }, 
      landlord_data: {
        landlord_type: String(formData.landlord_type),
        landlord_name: String(formData.landlord_name),
        landlord_id: Number(formData.landlord_id)
      },
      guarantor_data: {
        guarantor_type: String("individual"),
        guarantor_id: Number(formData.guarantor_id ?? 0),
        guarantee_amount: String(data.rentGuaranteeAmount ?? "0"),
      },
      tenants : tenants,
      charges: [
        {
          charge_type: "RENT",
          description: "Monthly Rent",
          amount: Number(data.monthlyRent),
          currency: Number(data.currencyType),
          frequency: String(data.paymentFrequency) as LeasePayload["charges"][0]["frequency"],
          effective_date: String(data.leaseStartDate),
          end_date: String(data.leaseEndDate),
          vat_inclusive: data.vatInclusive === "true"
        },
        {
          charge_type: "UTILITY",
          description: "Utility Charge",
          amount: Number(data.otherStandingCharging),
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
      lease_opening_balance_data,
      landlord_opening_balances_data: [
        {
          amount: String(data.landlordsOpeningBalance),
          commission_percentage: String(data.commissionPercentage),
          operating_costs_inclusive: data.operatingCostsIncluded === "true"
        }
      ]
    };
    if(Number(formData.guarantor_id ?? 0) === 0) delete PAYLOAD.guarantor_data
    if(Number(formData.landlord_id ?? 0) === 0) delete PAYLOAD.landlord_data
    if(String(data.landlordsOpeningBalance).length === 0) delete PAYLOAD.landlord_opening_balances_data

    
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
    searchItem,
    propertyName,
    propertyType,
    guaranteeItem,
    CURRENCY_OPTIONS,
    manualLogProperty,
    outstandingBalance,
    landlordIdentifier,
    primaryTenantAddress,
    tenantsOpeningBalance,
    changeTenantsOpeningBalances,
    setTenantsOpeningBalance,
    switchToPropertyContext,
    setPrimaryTenantAddress,
    setLandlordIdentifier,
    SET_CURRENCY_OPTIONS,
    setManualLogProperty,
    onSelectGuarantor,
    handleLeaseSubmit,
    setGuaranteeItem,
    handleUpdateForm,
    onSelectLandlord,
    onSelectProperty,
    setPropertyTypes,
    setPropertyName,
    setSearchItem,
    setShowModal,
    setFormData,
  }
}

export default useAddIndividualLease