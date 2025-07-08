import ServiceSidebar from "@/components/general/ServiceSidebar";
import { RENTSAFE_NAVLINKS } from "@/constants/routes";

export default function Sidebar() {
   return <ServiceSidebar title="Rent-Safe" navLinks={RENTSAFE_NAVLINKS} />;
}
