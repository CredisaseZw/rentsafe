import useLastNavLinkClicked from '../hooks/component-hooks/useLastNavLinkClicked.js';
import { activeTrackableClientNavLinks as NAV_LINKS } from '../constants';
import { Link } from '@inertiajs/inertia-react';
import { camelCase } from 'lodash';
import { clientSidebarNavigation } from '../constants/clientSidebarNavigation.jsx';
import React, { cloneElement } from 'react';

export default function ClientSidebar() {
  const { lastClicked, setLastClicked, key, setKey, lastLastClickedRef } =
    useLastNavLinkClicked();

  function onClick(identifierString, isUpperMost = false) {
    setLastClicked(identifierString);
    if (isUpperMost) setKey((prev) => prev + 1);
  }

  return (
    <div
      key={key}
      id="layoutDrawer_nav"
      className="bg-info border-end c-border-info-dark"
    >
      <nav id="drawerAccordion" className="drawer accordion border-0">
        <div className="drawer-menu pt-4">
          <div className="nav">
            {clientSidebarNavigation.map((navLink, index) => (
              <React.Fragment key={index}>
                {renderNavLink(
                  navLink,
                  0,
                  lastClicked,
                  setLastClicked,
                  lastLastClickedRef,
                  onClick
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="drawer-footer p-0 pb-4">
          <Link
            className={`nav-link c-nav-link d-flex gap-2 ${
              lastClicked === NAV_LINKS.PROFILE ? 'c-nav-link-active' : ''
            }`}
            onClick={() => {
              setLastClicked(NAV_LINKS.PROFILE);
              setKey((prev) => prev + 1);
            }}
            href={reverseUrl('cl-change-password')}
          >
            <i className="material-icons">account_circle</i>
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}

function renderNavLink(
  navLink,
  level = 0,
  lastClicked,
  setLastClicked,
  lastLastClickedRef,
  onClick,
  isUpperMost = true
) {
  if (navLink.subNavLinks) {
    const navLinkId = `${camelCase(navLink.navLink)}${level}`;
    const className = `nav-link c-${'sub-'.repeat(level)}nav-link collapsed ${lastClicked === navLinkId ? 'c-nav-link-active' : ''}`;

    return (
      <>
        <a
          className={className}
          onClick={() => onClick(navLinkId)}
          data-bs-target={`#collapse${navLinkId}`}
          aria-expanded="true"
          data-bs-toggle="collapse"
          aria-controls={`collapse${navLinkId}`}
        >
          {navLink.navLink}
          <div className="drawer-collapse-arrow">
            <i className="material-icons">expand_more</i>
          </div>
        </a>

        <div
          id={`collapse${navLinkId}`}
          className="collapse"
          data-bs-parent={`#drawerAccordion${level ? level - 1 : ''}`}
        >
          <div
            id={
              navLink.subNavLinks.some((item) => Boolean(item.subNavLinks))
                ? `drawerAccordion${level}`
                : undefined
            }
            className="drawer-menu-nested nav accordion"
          >
            {navLink.subNavLinks.map((sub, index) => (
              <React.Fragment key={index}>
                {renderNavLink(
                  sub,
                  level + 1,
                  lastClicked,
                  setLastClicked,
                  lastLastClickedRef,
                  onClick,
                  false
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    const navLinkId = `$${navLink.component} ${navLink.href} ${level}`;
    const className = `nav-link c-${'sub-'.repeat(level)}nav-link ${lastClicked === navLinkId ? 'c-nav-link-active' : ''}`;

    if (navLink.type === 'link') {
      return (
        <Link
          className={className}
          onClick={() => onClick(navLinkId, isUpperMost)}
          href={navLink.href}
        >
          {navLink.navLink}
        </Link>
      );
    } else {
      return cloneElement(navLink.component, {
        lastClicked,
        setLastClicked,
        lastLastClickedRef,
        className,
        key: navLinkId,
        onClick: () => {
          lastLastClickedRef.current = lastClicked;
          onClick(navLinkId, isUpperMost);
        },
      });
    }
  }
}
