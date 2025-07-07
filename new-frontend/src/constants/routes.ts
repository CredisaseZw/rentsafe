import Home from "@/routes/Home";
import NotFound from "@/routes/NotFound";
import RentsafeDashboard from "@/routes/rent-safe/Dashboard";
import ServicesHub from "@/routes/ServicesHub";
import type { Route } from "@/types";

export const ROOT_ROUTES: Route[] = [
   {
      label: "Home",
      path: "/",
      component: Home,
   },
   {
      label: "Services Hub",
      path: "/services",
      component: ServicesHub,
      isIndex: true,
   },
   {
      label: "Not Found",
      path: "*",
      component: NotFound,
   },
];

export const RENTSAFE_ROUTES: Route[] = [
   {
      path: "/",
      component: RentsafeDashboard,
      isIndex: true,
   },
];
