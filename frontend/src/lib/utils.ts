import EmptyComponent from "@/components/general/EmptyComponent";
import type { Address, BranchContact } from "@/interfaces";
import type { AddressPayload, ContactPayload } from "@/interfaces/form-payloads";
import type { Landlord, LeaseOpeningBalanceData, LeasePayload, NavLink, Route, Tenant, TenantPayload } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";
import type { PropertiesResponse, Property } from "@/types";
import { isAxiosError, type AxiosError } from "axios";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function navlinksToRoutes(navLinks: NavLink[]): Route[] {
   return navLinks
      .map((navLink) => {
         if (navLink.subLinks) {
            const routes = navLink.subLinks.map((subLink) => navlinksToRoutes([subLink])).flat();
            return routes;
         }
         return {
            label: navLink.label,
            path: navLink.path,
            pageComponent: navLink.pageComponent || EmptyComponent,
         } as Route;
      })
      .flat();
}

export function removeTrailingSlash(path: string) {
   return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function getInitials(name: string): string {
   const parts = name.split(" ");
   if (parts.length === 1) {
      return parts[0].trim().charAt(0).toUpperCase();
   }
   return parts[0].trim().charAt(0).toUpperCase() + parts[1].trim().charAt(0).toUpperCase();
}

export function formatCurrency(amount: number): string {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   }).format(amount);
}

export function friendlyDate(date: string | Date, format?: "second" | "third") {
   date = new Date(date);
   switch (format) {
      case "second":
         return Intl.DateTimeFormat("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
         }).format(date);
      case "third":
         return Intl.DateTimeFormat("en-GB", {
            month: "numeric",
            day: "2-digit",
            year: "2-digit",
         }).format(date);
      default:
         return Intl.DateTimeFormat("en-GB", {
            month: "short",
            day: "2-digit",
            year: "2-digit",
         }).format(date);
   }
}

export function getTimeElapsedSince(date: Date | string): string {
   const currentDate = new Date();
   const startDate = typeof date === "string" ? new Date(date) : date;

   const elapsedMilliseconds = currentDate.getTime() - startDate.getTime();

   if (elapsedMilliseconds < 1) return "now";

   const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
   const elapsedMinutes = Math.floor(elapsedSeconds / 60);
   const elapsedHours = Math.floor(elapsedMinutes / 60);
   const elapsedDays = Math.floor(elapsedHours / 24);
   const elapsedWeeks = Math.floor(elapsedDays / 7);
   const elapsedMonths = Math.floor(elapsedDays / 30);
   const elapsedYears = Math.floor(elapsedDays / 365);

   if (elapsedYears > 0) {
      return `${elapsedYears} y`;
   } else if (elapsedMonths > 0) {
      return `${elapsedMonths} m`;
   } else if (elapsedWeeks > 0) {
      return `${elapsedWeeks} w`;
   } else if (elapsedDays > 0) {
      return `${elapsedDays} d`;
   } else if (elapsedHours > 0) {
      return `${elapsedHours} hr`;
   } else {
      return `${elapsedMinutes} min`;
   }
}

export function toIntElseUndefined(value: string | number): number | undefined {
   const intValue = parseInt(value as string, 10);
   return isNaN(intValue) ? undefined : intValue;
}

// return YYYY-MM-DD
export function formatDateToPythonSLiking(date: string): string {
   const d = new Date(date);
   const year = d.getFullYear();
   const month = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

export function formatAddress(addr: Address): string {
   const parts: string[] = [];

   if (addr.street_address) parts.push(addr.street_address);
   if (addr.line_2) parts.push(addr.line_2);
   if (addr.suburb?.name) parts.push(addr.suburb.name);
   if (addr.city?.name) parts.push(addr.city.name);
   if (addr.province?.name) parts.push(addr.province.name);
   if (addr.postal_code) parts.push(addr.postal_code.toString());
   if (addr.country?.name) parts.push(addr.country.name);

   return parts.join(", ");
}
export function extractPhones(data: { [k: string]: FormDataEntryValue }) {
  const phones: { type: string; phone_number: string }[] = [];

  Object.keys(data).forEach((key) => {
    if (key.startsWith("number")) {
      const index = key.replace("number", ""); 
      const phone_number = data[key] as string;
      const type = (data[`type${index}`] as string) || "";

      if (phone_number.trim().length > 0) {
        phones.push({ type, phone_number });
      }
    }
  });

  return phones;
}


export function extractAddresses(data: { [k: string]: FormDataEntryValue }): AddressPayload[] {
   const addresses: AddressPayload[] = [];
   const addressesCount = Object.keys(data).filter((key) => key.startsWith("suburb_id")).length;
   for (let i = 1; i < addressesCount + 1; i++) {
      const address: AddressPayload = {
         is_primary: !!data[`is_primary_address${i}`],
         address_type: data[`address_type${i}`] as "physical" | "postal" | "billing" | "work" | "other",
         postal_code: data[`postal_code${i}`] as string,
         suburb_id: data[`suburb_id${i}`] as string,
         street_address: data[`street_address${i}`] as string,
      };
      addresses.push(address);
   }

   return addresses;
}

export function extractContacts(data: { [k: string]: FormDataEntryValue }): ContactPayload[] {
   const contacts: ContactPayload[] = [];
   const contactsCount = Object.keys(data).filter((key) => key.startsWith("contact_type")).length;

   for (let i = 1; i < contactsCount + 1; i++) {
      const contact: ContactPayload = {
         individual: toIntElseUndefined(data[`individual${i}`] as string)!,
         position: data[`position${i}`] as string,
         contact_type: data[`contact_type${i}`] as "email" | "phone" | "fax" | "other",
         is_primary: !!data[`is_primary${i}`],
      };
      contacts.push(contact);
   }

   return contacts;
}

export function extractTenants(data: { [k: string]: FormDataEntryValue }, type : string): TenantPayload[] {
  const tenants: TenantPayload[] = [];

  const tenantKeys = Object.keys(data).filter((key) => key.startsWith("tenants["));
  const tenantCount = tenantKeys.length;

  for (let i = 0; i < tenantCount; i++) {
    const tenant: TenantPayload = {
      tenant_id: data[`tenants[${i}]`] as string,
      tenant_type : type,
      is_primary_tenant: data[`isPrimary[${i}]`] === "on",
    };

    tenants.push(tenant);
  }

  return tenants;
}

export function extractReceipts(data: { [k: string]: FormDataEntryValue }, includeRentVariables: boolean): any[] {
  const receipts: any[] = [];

  const receiptKeys = Object.keys(data).filter((key) => key.startsWith("lease_id_"));
  const receiptCount = receiptKeys.length;
  for (let i = 0; i < receiptCount; i++) {
    const receipt = {
      lease_id: data[`lease_id_${i}`] as string,
      amount: data[`received_${i}`] as string,
      payment_method_id: Number(data[`paymentMethod_${i}`] as string),
      reference: data[`receipt_${i}`] as string,
      description: data[`description`] as string,
      payment_date: data[`date_${i}`] as string,
      ...(includeRentVariables
        ? {
            rent: data[`rent_${i}`] as string,
            opx: data[`opx_${i}`] as string,
          }
        : {}),
    };

    receipts.push(receipt);
  }

  return receipts;
}

export function extractFeatures (data: { category: string; feature: string}[]) : {[key: string]: any[]} {
   const features: { [key: string]: any[] } = {};
   data.forEach((item) => {
      if (item.category in features) {
            features[item.category].push(item.feature);
      } else {
            features[item.category] = [item.feature];
      }
   });

   return features;
}

export function formatErrorMessage(error: unknown): string {
   if (error instanceof Error) {
      return error.message;
   } else if (typeof error === "string") {
      return error;
   } else if (error && typeof error === "object" && "message" in error) {
      return (error as { message: string }).message;
   }
   return JSON.stringify(error, null, 2) || "An unknown error occurred";
}

export function validateZimNationalId(idNumber: string): boolean {
   //23155637M75
   const regex = /^\d{8,9}[A-Za-z]{1}\d{2}$/;
   return regex.test(idNumber);
}

export function stringifyAndFmt(val: unknown): string {
   if (val === null || val === undefined) return "";
   if (typeof val === "string") return val.replace(/^"|"$/g, "");
   if (typeof val === "object") {
      return JSON.stringify(val, (_, v) => (v === null || v === undefined ? undefined : v)).replace(/^"|"$/g, "");
   }
   return String(val);
}

export function updatePropertyListCache(
    client: QueryClient,
    property: Property
  ) {
    client.getQueryCache().findAll({
      predicate: (query) => query.queryKey[0] === "property_lists"
    }).forEach((query) => {
      client.setQueryData<PropertiesResponse>(query.queryKey, (old) => {
        if (old && old.results && Array.isArray(old.results)) {
          const isNew = !old.results.some((p) => p.id === property.id);
          const withoutDupes = old.results.filter((p) => p.id !== property.id);

          return {
            ...old,
            results: [...withoutDupes, property],
            count: isNew ? old.count + 1 : old.count
          };
        } else {
          return {
            count: 1,
            next: null,
            previous: null,
            results: [property]
          };
        }
      });
    });
  }
export function getPersistentData<T = any>(): T | null {
   const rawPersistentData = localStorage.getItem("persistentData");
   if (!rawPersistentData) return null;

   try {
      return JSON.parse(rawPersistentData) as T;
   } catch (error) {
      console.error("Failed to parse persistentData from localStorage:", error);
      return null;
   }
}

export function savePersistentData(name: string, data: any) {
   const persistentData = getPersistentData() || {};
   persistentData[name] = data;
   localStorage.setItem("persistentData", JSON.stringify(persistentData));
}
export function summarizeAddress(address: Address): string {
   return [
      address.street_address,
      address.suburb?.name,
      address.city?.name,
      address.province?.name,
      address.country?.code,
   ]
   .filter(Boolean)
   .join(", ");
}
export function getThreeMonthsBack(dayStr: string): string[] {
  const today = new Date();
  const inputDay = parseInt(dayStr, 10) || today.getDate();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const result: string[] = [];

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  for (let i = 3; i >= 0; i--) {
    let month = currentMonth - i;
    let year = currentYear;

    if (month < 0) {
      month += 12;
      year -= 1;
    }

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const day = Math.min(inputDay, lastDayOfMonth);

    result.push(`${String(day).padStart(2, "0")}-${monthNames[month]}-${String(year).slice(-2)}`);
  }

  return result;
}


export function capitalizeFirstLetter(str : string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractTenantBranchContact(contacts : BranchContact[]){
   return contacts
      .map(c => c.full_contact.split(" - ").pop() ?? "")
      .filter(num => num !== "")
      .join(", ");
}

export function riskLevelColorCode(level: "HIGH HIGH" | "NON_PAYER" | "HIGH" | "MEDIUM" | "LOW"):string {
   const colorCodes  ={
      "HIGH HIGH" : "bg-red-600",
      "NON_PAYER" : "bg-black",
      "HIGH" : "bg-red-500",
      "MEDIUM" : "bg-yellow-400",
      "LOW" : "bg-green-600"
   }
   return colorCodes[level as keyof typeof colorCodes]
}

export function clearPersistentData() {
   localStorage.removeItem("persistentData");
}

export function validateBalances(
  data: LeaseOpeningBalanceData
): { valid: boolean; message?: string | null} {
  const order = [
      "three_months_plus_balance",
      "three_months_back_balance",
      "two_months_back_balance",
      "one_month_back_balance",
      "current_month_balance",
  ] as const;

   const balances = order.map((key) => ({
      key,
      value: data[key] || 0,
   }));
   let valid = true;
   let message  = null;
   for (let i = 0; i < balances.length - 1; i++) {
      if (balances[i].value > 0) {
         for(let j = i + 1; j < balances.length - 1; j++){
            if(balances[j].value === 0){
               valid = false;
               message = `Invalid sequence: "${balances[j].key.replaceAll("_", " ")}" is requires a balance.`
            }
        }
    }
  }

  const total = balances.reduce((sum, b) => sum + b.value, 0);
  const outstanding = data.outstanding_balance || 0;
  if (total !== outstanding) {
      return {
         valid: false,
         message: `Outstanding balance (${outstanding}) does not match sum of balances (${total}).`,
      };
  }

  return { valid: valid, message : message };
};

export const getCurrentDate = ():string => {
   const today = new Date();  
   return today.toISOString().split("T")[0];   
}
export const validateAmounts = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
};

export const getPrimaryTenantName = (tenants: Tenant[]) => {
   const name = tenants.find((t) => t.is_primary_tenant)?.tenant_object.full_name ?? "";
   return name
}

export function getSummaryDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function parseListString(s : string) : string{
   const fixed = s.replace(/'/g, '"');
   const arr = JSON.parse(fixed);
   return arr[0];
}
export function formatPhones(phones: { type: string; phone_number: string }[]): string {
  return phones
    .map(p => `${p.phone_number}`)
    .join(" | ");
}

export function formatLandlords(landlords: Landlord[]): string {
   if (landlords.length === 0) return "";
   if (landlords.length === 1) return landlords[0].landlord_name;
   return landlords.map((l) => l.landlord_name).join(" | ");   
}

export function validateYear(year: string): boolean {
  const currentYear = new Date().getFullYear();
  if (!/^\d{4}$/.test(year)) {
    return false;
  }

  const numericYear = parseInt(year, 10);
  return numericYear >= 1900 && numericYear <= currentYear + 5;
}

export function normalizeLeaseResponse(apiLease: any): LeasePayload {
    const tenants = apiLease.tenants.map((t:any) => ({
      tenant_id: String(t.tenant_object?.id),
      tenant_type: "individual",
      is_primary_tenant: t.is_primary_tenant
    })
  );
   return {
      start_date: apiLease.start_date,
      end_date: apiLease.end_date,
      signed_date: apiLease.signed_date,
      status: apiLease.status,
      currency: apiLease.currency.id,
      payment_frequency: apiLease.payment_frequency,
      due_day_of_month: apiLease.due_day_of_month,
      grace_period_days: apiLease.grace_period_days,
      is_rent_variable: apiLease.is_rent_variable,
      includes_utilities: apiLease.includes_utilities,
      property_data: apiLease.unit.property,
      unit_data: {
         unit_number: apiLease.unit.unit_number,
         unit_type: apiLease.unit.unit_type,
         number_of_rooms: apiLease.unit.number_of_rooms,
      },
      address_data: {
         street_address: apiLease.unit.property.addresses[0]?.street_address ?? "",
         suburb_id: Number(apiLease.unit.property.addresses[0]?.suburb?.id ),
         postal_code: apiLease.unit.property.addresses[0]?.postal_code ?? "",
      },
      landlord_data: {
         landlord_type: apiLease.landlord_opening_balances_data?.[0]?.landlord.landlord_type ?? "",
         landlord_name: apiLease.landlord_opening_balances_data?.[0]?.landlord.landlord_name ?? "",
         landlord_id: Number(apiLease.landlord_opening_balances_data?.[0]?.landlord.landlord_id),
      },
      guarantor_data: {
         guarantor_type: "individual",
         guarantor_id: Number(apiLease.guarantor?.guarantor_object.id),
         guarantee_amount: String(apiLease.guarantor?.guarantee_amount),
      },
      tenants: tenants,
      charges: apiLease.charges,
      deposits: apiLease.deposits,
      lease_opening_balance_data: apiLease.lease_opening_balance_data,
      landlord_opening_balances_data: [{
         amount: apiLease.landlord_opening_balances_data?.[0]?.amount ?? "",
         commission_percentage: apiLease.landlord_opening_balances_data?.[0]?.commission_percentage ?? "",
         operating_costs_inclusive: apiLease.landlord_opening_balances_data?.[0]?.operating_costs_inclusive,
      }],
   };
}

function cleanObject<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => cleanObject(v))
      .filter((v) => v !== undefined && v !== null) as T;
  } else if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        value !== undefined &&
        value !== null &&
        !(typeof value === "number" && Number.isNaN(value))
      ) {
        cleaned[key] = cleanObject(value);
      }
    }

    if(cleaned?.landlord_data?.landlord_name  === "" ) delete cleaned.landlord_data
    return cleaned;
  }
  return obj;
}

export const generateUpdatePayload = (
    updated: LeasePayload,
    original: LeasePayload
  ): Partial<LeasePayload> => {
    const diff: Partial<LeasePayload> = {};
    if (updated.unit_data) {
      if (updated.unit_data.number_of_rooms === undefined || updated.unit_data.number_of_rooms === null) {
        updated.unit_data.number_of_rooms = 0;
      }
    }
    if (updated.signed_date) {
      delete updated.signed_date;
    }

    if(updated.due_day_of_month){
      delete updated.due_day_of_month
    }

    console.log("UPDATED", updated)
    console.log("ORIGINAL", original) 
    const scalarFields: (keyof LeasePayload)[] = [
      "start_date",
      "end_date",
      "status",
      "currency",
      "payment_frequency",
      "due_day_of_month",
      "grace_period_days",
      "is_rent_variable",
      "includes_utilities",
    ];

    scalarFields.forEach((field) => {
      if (updated[field] !== original[field] && updated[field] !== undefined) {
        (diff as any)[field] = updated[field];
      }
    });

    // property_data + unit_data + address_data
    if (updated.property_data?.name !== original.property_data?.name) {
      diff.property_data = {
        ...updated.property_data,
      };
      }

    if (JSON.stringify(updated.unit_data) !== JSON.stringify(original.unit_data)) {
      diff.unit_data = updated.unit_data;
    }
    
    // HANDLE ADDRESS
    if (JSON.stringify(updated.address_data) !== JSON.stringify(original.address_data)) {
      diff.address_data = updated.address_data;
    }

    // landlord_data
    if (JSON.stringify(updated.landlord_data) !== JSON.stringify(original.landlord_data)) {
      diff.landlord_data = updated.landlord_data;
    }

    // guarantor_data: only if guarantor_id or amount changed
    if (
      updated.guarantor_data?.guarantor_id !== original.guarantor_data?.guarantor_id
    ) {
      diff.guarantor_data = updated.guarantor_data;
    }

    // tenants: check size first, then deep loop
    if (updated.tenants?.length !== original.tenants?.length) {
      diff.tenants = updated.tenants;
    } else if (updated.tenants && original.tenants) {
      let tenantsChanged = false;
      for (let i = 0; i < updated.tenants.length; i++) {
        if (JSON.stringify(updated.tenants[i]) !== JSON.stringify(original.tenants[i])) {
          tenantsChanged = true;
          break;
        }
      }
      if (tenantsChanged) {
        diff.tenants = updated.tenants;
      }
    }

    // CHECK CHARGES
    if (updated.charges && original.charges) {
      const changedCharges = updated.charges
      .filter((charge, idx) => {
        const orig = original.charges[idx];
        if (charge.amount === 0 && charge.charge_type === "UTILITY") {
        return false;
        }
        return Number(charge.amount.toFixed(2)) !== Number(orig?.amount);
      });
      if (changedCharges.length > 0) {
        diff.charges = changedCharges;
      }
    }
    
    // deposits: only if currency/amount/holder/date changed
    if (updated.deposits && original.deposits) {
      const changedDeposits = updated.deposits.filter((dep, idx) => {
        if (!original.deposits || !original.deposits[idx]) return true;
        const orig = original.deposits[idx];
        return (
          Number(dep.amount.toFixed(2)) !== Number(orig.amount) ||
          dep.currency !== orig.currency ||
          dep.deposit_date !== orig.deposit_date ||
          dep.deposit_holder !== orig.deposit_holder
        );
      });
      if (changedDeposits.length > 0) {
        diff.deposits = changedDeposits;
      }
    }
    // lease_opening_balance_data: loop fields
    if (updated.lease_opening_balance_data && original.lease_opening_balance_data) {
      const changed: Partial<typeof updated.lease_opening_balance_data> = {};

      type LeaseOpeningBalanceKey =
        | "current_month_balance"
        | "one_month_back_balance"
        | "two_months_back_balance"
        | "three_months_back_balance"
        | "three_months_plus_balance"
        | "outstanding_balance";

      const keys: LeaseOpeningBalanceKey[] = [
        "current_month_balance",
        "one_month_back_balance",
        "two_months_back_balance",
        "three_months_back_balance",
        "three_months_plus_balance",
        "outstanding_balance",
      ];
      
      for (const key of keys) {
        if (Number(updated.lease_opening_balance_data[key].toFixed(2)) !== Number(original.lease_opening_balance_data[key])) {
          changed[key] = updated.lease_opening_balance_data[key];
        }
      }

      if (Object.keys(changed).length > 0) {
        diff.lease_opening_balance_data = {
          ...changed,
          id: original.lease_opening_balance_data.id,
        } as LeasePayload["lease_opening_balance_data"];
      }
    }

    if (
      JSON.stringify(updated.landlord_opening_balances_data) !==
      JSON.stringify(original.landlord_opening_balances_data)
    ) {
      diff.landlord_opening_balances_data = updated.landlord_opening_balances_data;
    }

    return cleanObject(diff);
  };

export const handleAxiosError = (
  title: string,
  error: AxiosError | Error | unknown | null,
  fallBackMessage?: string
): boolean => {
  if (isAxiosError(error)) {
    console.error(error);
    const message =
      error.response?.data?.error ??
      error.response?.data?.detail ??
      error.message ??
      "Something went wrong";
    toast.error(title, { description: message });
    return true;
  }

  if (error instanceof Error && fallBackMessage) {
    toast.error(fallBackMessage);
    return true;
  }

  if (!isAxiosError(error) && !error && fallBackMessage) {
    toast.error(fallBackMessage);
    return true;
  }

  return false;
};
