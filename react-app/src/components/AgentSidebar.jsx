import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';

const AgentSidebar = () => {
  const [userToggle, setUserToggle] = useState(false);
  const [subToggle, setSubToggle] = useState(false);
  const [accToggle, setAccSubToggle] = useState(false);

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
      <nav
        className="drawer accordion drawer-light bg-white"
        id="drawerAccordion"
      >
        <div className="drawer-menu" style={{ backgroundColor: '#26a69a' }}>
          <div className="nav">
            <div className="drawer-menu-heading"></div>
            <Link
              className="nav-link mdc-ripple-upgraded text-white"
              href={reverseUrl('home')}
              style={{ cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">dashboard</i>
              </div>
              Dashboard
            </Link>

            <Link
              className="nav-link text-white collapsed mdc-ripple-upgraded collapse"
              // onClick={handleClickUserToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
              style={{ cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}
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
              className="collapse show"
              id="collapsePages"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav
                className="drawer-menu-nested nav accordion"
                id="drawerAccordionPages"
              >
                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl('search_company_users')}
                >
                  Company
                </Link>

                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl('search_individual_users')}
                >
                  Individual
                </Link>
              </nav>
            </div>
            <a
              className="collapse nav-link collapsed text-white mdc-ripple-upgraded "
              // onClick={handleClickSubToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
              style={{ cursor: 'pointer', fontWeight: 500, fontSize: '16px' }}
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
              className="show collapse text-white ${subToggle "
              id="collapsePages"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav
                className="drawer-menu-nested nav accordion"
                id="drawerAccordionPages"
              >
                <Link
                  className="nav-link text-white mdc-ripple-upgraded"
                  href={reverseUrl('active_subcription')}
                >
                  Active
                </Link>
              </nav>
            </div>
            <a
              className="collapse nav-link text-white collapsed mdc-ripple-upgraded" // onClick={handleClickAccToggle}
              data-bs-toggle="collapse"
              data-bs-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
              style={{ cursor: 'pointer', fontWeight: 500, fontSize: '16px' }}
            >
              <div className="nav-link-icon">
                <i className="material-icons">layers</i>
              </div>
              Accounting
              <div className="drawer-collapse-arrow">
                <i className="material-icons">expand_more</i>
              </div>
            </a>

            {/* <div
              className="show collapse text-white "
              id="collapsePages"
              aria-labelledby="headingTwo"
              data-bs-parent="#drawerAccordion"
            >
              <nav
                className="drawer-menu-nested nav accordion"
                id="drawerAccordionPages"
              >
                <a className="nav-link  text-white mdc-ripple-upgraded" href="">
                  Cash Book
                </a>

                <a className="nav-link text-white mdc-ripple-upgraded" href="#">
                  Agency
                </a>

                <a className="nav-link text-white mdc-ripple-upgraded" href="#">
                  Unearned Income
                </a>

                <a className="nav-link text-white mdc-ripple-upgraded" href="#">
                  VAT
                </a>
              </nav>
            </div> */}
          </div>
        </div>
        <div className="drawer-footer border-top">
          <div className="d-flex align-items-center">
            <i className="material-icons text-muted">account_circle</i>
            <div className="ms-3">
              <a className="text-muted" href="#">
                Profile
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AgentSidebar;
