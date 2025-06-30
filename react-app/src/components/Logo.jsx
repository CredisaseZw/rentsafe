import { Link } from "@inertiajs/inertia-react";
import LogoSvg from "./LogoSvg.jsx";

export default function Logo() {
  return (
    <Link
      href="/"
      style={{ color: "inherit" }}
      className="text-decoration-none d-flex align-items-end gap-2"
    >
      <div
        style={{
          width: "1.2em",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <LogoSvg />
      </div>

      <div style={{ marginBottom: "-5px" }} className="fs-5 text-capitalize fw-bold">
        Fincheck
      </div>
    </Link>
  );
}
