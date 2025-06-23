import ClientSidebar from "../../ClientSidebar.jsx";
import CustomToaster from "../../CustomToaster.jsx";
import { Head, Link, usePage } from "@inertiajs/inertia-react";

export default function Layout({ children, title }) {
  const { Auth } = usePage().props;
  const toggleSidebar = () => document.body.classList.toggle("drawer-toggled");

  return (
    <>
      <Head title={title} />
      <CustomToaster />

      <div className="nav-fixed">
        <nav className="top-app-bar navbar navbar-expand bg-info navbar-dark shadow-sm">
          <div className="container-fluid px-4">
            <button id="drawerToggle" onClick={toggleSidebar} className="btn rounded-circle">
              <i className="material-icons">menu</i>
            </button>

            <Link className="navbar-brand me-auto" to="/">
              <div className="font-monospace" style={{ fontWeight: "bold", fontSize: "20px" }}>
                CrediSafe
              </div>
            </Link>

            <div className="d-flex align-items-center gap-3">
              <div className="text-white text-decoration-none fw-semibold">
                {Auth?.company.company_name ? Auth.company.company_name : ""}
              </div>

              <div className="dropdown">
                <button
                  className="btn rounded-circle dropdown-toggle"
                  id="dropdownMenuProfile"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="c-scale-down material-icons">person</i>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end border border-2 p-1 mt-3"
                  aria-labelledby="dropdownMenuProfile"
                >
                  <li>
                    <a
                      className="dropdown-item h-auto py-1 rounded-3 px-3"
                      href={reverseUrl("logout")}
                    >
                      Logout
                      <i className="material-icons c-scale-down ms-2">logout</i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div id="layoutDrawer">
          <ClientSidebar />

          <div id="layoutDrawer_content">
            <div className="p-4 container-xxl">{children}</div>

            <footer
              id="footer"
              className="p-4 border-top d-flex justify-content-between align-items-center"
            >
              <p className="text-muted small m-0">© Credi-Safe {new Date().getFullYear()}</p>

              <button
                onClick={() => window.scrollTo(0, 0)}
                type="button"
                className="btn border rounded-circle p-1 btn-sm"
              >
                <i className="material-icons">arrow_upward</i>
              </button>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
