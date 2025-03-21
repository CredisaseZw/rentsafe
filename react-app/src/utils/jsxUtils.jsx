import { camelCase } from "lodash";
import { clientSidebarNavigation } from "../constants/clientSidebarNavigation.jsx";

export function determineInitial(path) {
  let navLink, id;
  switch (path) {
    case "/clients/":
    case "/clients/get-":
    case "/clients/companies/":
      return "dashboard";
    case "/clients/cl-change_password/":
      return "profileInMainParent";
    default:
      return "";
  }
}
