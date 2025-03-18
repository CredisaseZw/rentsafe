import { Link } from "@inertiajs/inertia-react";
import { camelCase } from "lodash";
import { cloneElement, useRef } from "react";

export default function NavLink({
  data: { navLink, type, href, subNavLinks, component, color },
  level,
  activeNavLinkId,
  makeActive,
  lastActiveRef,
  parent,
  incrementKey,
}) {
  let id;
  if (navLink.toLowerCase() === "dashboard") {
    id = "dashboard";
  } else {
    id = `${parent?.current?.id || ""}${camelCase(navLink)}${level}${type}${href}${subNavLinks?.length}${Boolean(component)}`;
  }
  const isActive = id === activeNavLinkId;
  const isCollapsable = Boolean(subNavLinks);
  const parentRef = useRef();

  let label;
  const labelClassName = `c-new-nav-link c-level-${level}  ${isActive ? "c-new-nav-link-active" : ""}`;

  if (isCollapsable) {
    label = (
      <a
        style={{ color: color || "black !important" }}
        className={`justify-content-between gap-2 ${labelClassName}`}
        data-bs-toggle="collapse"
        href={"#" + id}
        role="button"
        aria-expanded="false"
        aria-controls={id}
        onClick={() => makeActive(id)}
      >
        {navLink}

        <div className="c-collapse-arrow">
          <i style={{ color: color || "black !important" }} className="material-icons">
            expand_more
          </i>
        </div>
      </a>
    );
  } else {
    label =
      type === "link" ? (
        <Link
          style={{ color: color || "black !important" }}
          className={labelClassName}
          href={href}
          onClick={() => {
            if (parent.current.id === "mainParent") incrementKey();
            makeActive(id);
          }}
        >
          {navLink}
        </Link>
      ) : (
        cloneElement(component, {
          key: id,
          className: labelClassName,
          style: { color: color || "black !important" },
          id,
          makeActive,
          beforeOpenningModal: () => {
            lastActiveRef.current = activeNavLinkId;
          },
        })
      );
  }

  const collapsableContent = isCollapsable ? (
    <div
      style={{
        color: color || "black !important",
        width: "95%",
      }}
      className={`${level === 1 ? "mx-auto custom-rounded-05 py-2 mt-2 overflow-hidden c-bg-whitesmoke" : ""}  collapse`}
      id={id}
      data-bs-parent={`#${parent?.current?.id}`}
    >
      <div ref={parentRef} id={`parent${id}${level}`}>
        {subNavLinks.map((navLink, index) => (
          <NavLink
            key={index}
            data={navLink}
            level={level + 1}
            parent={parentRef}
            {...{ activeNavLinkId, makeActive, lastActiveRef }}
          />
        ))}
      </div>
    </div>
  ) : (
    ""
  );

  return (
    <div>
      {label}
      {collapsableContent}
    </div>
  );
}
