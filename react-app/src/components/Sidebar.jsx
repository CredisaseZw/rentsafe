import { Link, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";

const Sidebar = () => {
  const [userToggle, setUserToggle] = useState(false);
  const [subToggle, setSubToggle] = useState(false);
  const [accToggle, setAccSubToggle] = useState(false);

  const userType = usePage().props?.Auth?.user?.user_type;

  const handleClickUserToggle = () => {
    setUserToggle(!userToggle);
  };
  const handleClickSubToggle = () => {
    setSubToggle(!subToggle);
  };
  const handleClickAccToggle = () => {
    setAccSubToggle(!accToggle);
  };
  return (
    <div id="layoutDrawer_nav">
      <nav className="drawer accordion drawer-light bg-white" id="drawerAccordion">
        <div className="drawer-menu" style={{ backgroundColor: "#26a69a" }}>
          <div className="nav">
            <div className="drawer-menu-heading"></div>
            <Link
              className="nav-link mdc-ripple-upgraded text-white"
              href={reverseUrl("home")}
              style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">dashboard</i>
              </div>
              Dashboard
            </Link>

            <Link
              className={`nav-link text-white collapsed mdc-ripple-upgraded collapse ${
                accToggle ? "collapse" : ""
              }`}
              // onClick={handleClickUserToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
              style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">layers</i>
              </div>
              User Management
              <div className="drawer-collapse-arrow">
                <i className="material-icons">expand_more</i>
              </div>
            </Link>

            <div
              className="collapse"
              id="collapsePages"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav className="drawer-menu-nested nav accordion" id="drawerAccordionPages">
                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl("search_company_users")}
                >
                  Company
                </Link>

                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl("search_contracted_companies")}
                >
                  Clients
                </Link>
                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl("search_individual_users")}
                >
                  Individual
                </Link>

                {userType && userType === 2 && (
                  <Link
                    className="nav-link text-white mdc-ripple-upgraded"
                    href={reverseUrl("search-agents")}
                  >
                    Agency
                  </Link>
                )}
              </nav>
            </div>
            <a
              className={`collapse nav-link collapsed text-white mdc-ripple-upgraded  ${
                accToggle ? "collapse" : ""
              }`}
              // onClick={handleClickSubToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapseSubScription"
              aria-expanded="true"
              aria-controls="collapseSubScription"
              style={{ cursor: "pointer", fontWeight: 500, fontSize: "16px" }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">layers</i>
              </div>
              Subscription
              <div className="drawer-collapse-arrow">
                <i className="material-icons">expand_more</i>
              </div>
            </a>

            <div
              className="collapse text-white ${subToggle "
              id="collapseSubScription"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav className="drawer-menu-nested nav accordion" id="drawerAccordionSubScription">
                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl("active_subcription")}
                >
                  Active
                </Link>

                {userType && userType === 2 && (
                  <>
                    <Link
                      className="nav-link text-white mdc-ripple-upgraded"
                      href={reverseUrl("unallocated_subcription")}
                    >
                      Unallocated
                    </Link>
                    <Link
                      className="nav-link text-white mdc-ripple-upgraded"
                      href={reverseUrl("historic_subcription")}
                    >
                      Historic
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <a
              className="collapse nav-link text-white collapsed mdc-ripple-upgraded" // onClick={handleClickAccToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapseAccounting"
              aria-expanded="true"
              aria-controls="collapseAccounting"
              style={{ cursor: "pointer", fontWeight: 500, fontSize: "16px" }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">layers</i>
              </div>
              Accounting
              <div className="drawer-collapse-arrow">
                <i className="material-icons">expand_more</i>
              </div>
            </a>

            <div
              className="collapse text-white "
              id="collapseAccounting"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                <a
                  className="nav-link text-white mdc-ripple-upgraded"
                  href="#"
                  style={{ fontWeight: "500" }}
                >
                  Invoicing
                </a>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a
                      className="nav-link  text-white mdc-ripple-upgraded"
                      href={reverseUrl("standard_subs_pricing")}
                    >
                      Pricing
                    </a>
                  </nav>
                </div>

                <a
                  className="nav-link text-white mdc-ripple-upgraded"
                  href="#"
                  style={{ fontWeight: "500" }}
                >
                  Cash Book
                </a>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      Receipts
                    </a>
                  </nav>
                </div>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      Payments
                    </a>
                  </nav>
                </div>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      CashBook Ledger
                    </a>
                  </nav>
                </div>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      CashBook Settings
                    </a>
                  </nav>
                </div>

                <a
                  className="nav-link text-white mdc-ripple-upgraded"
                  href="#"
                  style={{ fontWeight: "500" }}
                >
                  Agency Ledger
                </a>

                <a
                  className="nav-link text-white mdc-ripple-upgraded"
                  href="#"
                  style={{ fontWeight: "500" }}
                >
                  Reports
                </a>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      Income
                    </a>
                  </nav>
                </div>
                <div
                  className="collapse text-white "
                  id="collapseAccounting"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#drawerAccordion"
                >
                  <nav className="drawer-menu-nested nav accordion" id="drawerAccordionAccounting">
                    <a className="nav-link  text-white mdc-ripple-upgraded" href="#">
                      VAT
                    </a>
                  </nav>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="drawer-footer border-top">
          <div className="d-flex align-items-center">
            <i className="material-icons text-muted">account_circle</i>
            <div className="ms-3">
              <a className="text-muted" href={reverseUrl("change-password")}>
                Profile
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
