import { usePage } from "@inertiajs/inertia-react";

export default function useIsNavLinkActive() {
  const { component, url } = usePage();

  function isActive(urlToCompare, componentToCompare) {
    if (
      url === urlToCompare ||
      component.startsWith(componentToCompare) ||
      component === componentToCompare
    ) {
      return "c-nav-link-active";
    } else return "";
  }

  return isActive;
}
