import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import Sidebar from '../../Sidebar.jsx';
import { Toaster } from 'react-hot-toast';
const Layout = ({ children }) => {
  const { Auth } = usePage().props;
  const { lastName, setLastName } = useState();
  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  // if(Auth){
  //   if(Auth.user_profile.first_name){
  //     // setLastName(Auth.user_profile.first_name)
  //     console.log(Auth?.user_profile?.first_name)
  //   }

  // }

  if (toggle) {
    document.body.classList.add('drawer-toggled');
  } else {
    document.body.classList.remove('drawer-toggled');
  }
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      <div className="nav-fixed bg-light bar">
        <nav className="top-app-bar navbar navbar-expand bg-info navbar-dark">
          <div className="container-fluid px-4">
            <button
              onClick={handleClick}
              className="btn btn-lg btn-icon order-1 order-lg-0
                  mdc-ripple-upgraded"
              id="drawerToggle"
            >
              <i className="material-icons">menu</i>
            </button>
            <Link className="navbar-brand me-auto" to="/">
              <div
                className="font-monospace"
                style={{ fontWeight: 'bold', fontSize: '20px' }}
              >
                CrediSafe
              </div>
            </Link>
            <div className="d-flex align-items-center mx-3 me-lg-0">
              <ul className="navbar-nav d-none d-lg-flex">
                <li className="nav-item">
                  <Link className="nav-link" href="#">
                    {Auth?.user_profile.first_name
                      ? Auth.user_profile.first_name
                      : ''}
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                <div className="dropdown">
                  <button
                    className="btn btn-lg btn-icon dropdown-toggle
                              mdc-ripple-upgraded"
                    id="dropdownMenuProfile"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="material-icons">person</i>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end mt-3"
                    aria-labelledby="dropdownMenuProfile"
                  >
                    <li>
                      <a
                        className="dropdown-item mdc-ripple-upgraded"
                        href="/client-profile"
                      >
                        <i className="material-icons leading-icon">person</i>
                        <div className="me-3">Profile</div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item mdc-ripple-upgraded"
                        href="/update-password"
                      >
                        <i className="material-icons leading-icon">settings</i>
                        <div className="me-3">Settings</div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item mdc-ripple-upgraded"
                        href="#!"
                      >
                        <i className="material-icons leading-icon">help</i>
                        <div className="me-3">Help</div>
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item mdc-ripple-upgraded"
                        href={reverseUrl('logout')}
                      >
                        <i className="material-icons leading-icon">logout</i>
                        <div className="me-3">Logout</div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div id="layoutDrawer">
          <Sidebar />

          <div id="layoutDrawer_content">
            {children}

            <footer
              className="py-4 mt-auto border-top"
              style={{ minHeight: '74px' }}
            >
              <div className="container-xl px-5">
                <div
                  className="d-flex flex-column flex-sm-row
                          align-items-center justify-content-sm-between
                          small"
                >
                  <div className="me-sm-2">Copyright © RentSafe 2023</div>
                  <div className="d-flex ms-sm-2">
                    <a className="text-decoration-none" href="#!">
                      Privacy Policy
                    </a>
                    <div className="mx-1">·</div>
                    <a className="text-decoration-none" href="#!">
                      {/* Terms &amp; Conditions */}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default (page) => <Layout>{page}</Layout>;
