import { Link } from "@inertiajs/inertia-react";
import HoverDropdown from "./HoverDropdown.jsx";
import Logo from "./Logo.jsx";
import React from "react";

export default function LandingPageHeader() {
  const [styles, setStyles] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setStyles("bg-black shadow");
      } else {
        setStyles("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={"py-2 c-z-max fixed-top transition-all " + styles}>
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
              className="btn btn-sm rounded-pill fw-bold py-2 px-3  btn-light border border-dark text-capitalize "
            >
              Contact
            </Link>

            <div className="d-none d-md-block">
              <Link
                href={reverseUrl("login")}
                className="btn btn-sm rounded-pill fw-bold py-2 px-3  btn-info text-white border border-dark text-capitalize"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
