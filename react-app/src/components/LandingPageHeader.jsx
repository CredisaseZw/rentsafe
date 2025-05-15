import { Link } from "@inertiajs/inertia-react";
import HoverDropdown from "./HoverDropdown.jsx";
import Logo from "./Logo.jsx";

export default function LandingPageHeader() {
  return (
    <header className="bg-white p-2 mb-4 sticky-top shadow-md border-bottom border-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <Logo />

          <div className="d-none d-md-flex gap-3">
            <HoverDropdown
              label="Services"
              items={[
                { title: "Credit Scoring", href: "#credit-scoring" },
                { title: "RentSafe", href: "#rentsafe" },
                { title: "CountSafe", href: "#countsafe" },
                { title: "Debt Collection", href: "#debt-collection" },
              ]}
            />

            <HoverDropdown label="Resources" items={[{ title: "Contact", href: "#contact" }]} />
          </div>

          <nav className="d-flex align-items-center gap-3">
            <Link
              href="#contact"
              className="btn btn-sm btn-light border border-dark text-capitalize "
            >
              Contact
            </Link>
            <Link
              href={reverseUrl("login")}
              className="btn btn-sm btn-info text-white border border-dark text-capitalize"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
