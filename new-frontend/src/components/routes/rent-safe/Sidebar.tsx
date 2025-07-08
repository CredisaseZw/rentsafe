import ServiceSidebar from "@/components/general/ServiceSidebar";
import { RENTSAFE_NAVLINKS } from "@/constants/navlinks";

export default function Sidebar() {
   return <ServiceSidebar title="Rent-Safe" navLinks={RENTSAFE_NAVLINKS} />;
}
