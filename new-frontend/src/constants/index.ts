import Home from "@/routes/Home";
import NotFound from "@/routes/NotFound";
import ServicesHub from "@/routes/ServicesHub";
import type { Route } from "@/types";

export const ROUTES: Route[] = [
   {
      href: "/",
      component: Home,
   },
   {
      href: "/services",
      component: ServicesHub,
      isIndex: true,
   },
   {
      href: "*",
      component: NotFound,
   },
];
