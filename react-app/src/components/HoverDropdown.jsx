import { Link } from "@inertiajs/inertia-react";
import { useEffect, useRef, useState } from "react";

export default function HoverDropdown({ label, items, anchor }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="position-relative inline-block" ref={dropdownRef} onClick={() => setOpen(true)}>
      <button className="c-text-inherit btn p-1 shadow-none justify-content-center c-hover-fade text-capitalize">
        {label}
        <i className="material-icons ms-1" style={{ fontSize: "150%" }}>
          expand_more
        </i>
      </button>

      {open && (
        <ul
          style={{
            minWidth: "130px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
          className={`position-absolute top-100 ${anchor === "left" ? "start-0" : anchor === "right" ? "end-0" : "start-50 translate-middle-x"} c-z-max c-w-fit bg-dark border border-light shadow custom-rounded-1 list-unstyled  p-3`}
        >
          {items.map((item, index) => (
            <li key={index}>
              <Link
                onClick={(e) => setOpen(false)}
                href={item.href}
                className="btn text-capitalize w-100 text-light h-100 btn-sm text-nowrap shadow-none c-hover-fade justify-content-center text-center"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
