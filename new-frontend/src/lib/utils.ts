import EmptyComponent from "@/components/general/EmptyComponent";
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
