import ServiceSidebar from "@/components/general/ServiceSidebar";
import { RENTSAFE_APP_NAVLINKS, RENTSAFE_TRUST_ACCOUNTING_NAVLINKS, RENTSAFE_ACCOUNTING_NAVLINKS, RENT_ADMIN_PANEL_NAVLINKS } from "@/constants/navlinks";

export default function Sidebar() {
   return <ServiceSidebar 
      title="Rentsafe"
      rentsafeAppNavlinks={RENTSAFE_APP_NAVLINKS}
      rentsafeTrustAccountingNavlinks={RENTSAFE_TRUST_ACCOUNTING_NAVLINKS}
      rentsafeAccountingNavlinks={RENTSAFE_ACCOUNTING_NAVLINKS}
      rentsafeAdminPanelNavlinks={RENT_ADMIN_PANEL_NAVLINKS}
      />;
}
