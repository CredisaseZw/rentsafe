import EmptyComponent from "@/components/general/EmptyComponent";
import type { Address } from "@/interfaces";
import type { AddressPayload } from "@/interfaces/form-payloads";
import type { NavLink, Route } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function extractAddresses(data: { [k: string]: FormDataEntryValue }): AddressPayload[] {
   const addresses: AddressPayload[] = [];
   const addressesCount = Object.keys(data).filter((key) => key.startsWith("city_id")).length;
   for (let i = 1; i < addressesCount + 1; i++) {
      const address: AddressPayload = {
         is_primary: !!data[`is_primary${i}`],
         address_type: data[`address_type${i}`] as "physical" | "postal" | "billing" | "work" | "other",
         postal_code: data[`postal_code${i}`] as string,
         country_id: toIntElseUndefined(data[`country_id${i}`] as string),
         province_id: toIntElseUndefined(data[`province_id${i}`] as string),
         city_id: toIntElseUndefined(data[`city_id${i}`] as string)!,
         suburb_id: toIntElseUndefined(data[`suburb_id${i}`] as string),
         street_address: data[`street_address${i}`] as string,
      };
      addresses.push(address);
   }

   return addresses;
}
