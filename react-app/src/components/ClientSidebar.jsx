import NavLink from './NavLink.jsx';
import useClientSidebar from '../hooks/component-hooks/useClientSidebar.js';
import { clientSidebarNavigation as navLinks } from '../constants/clientSidebarNavigation.jsx';
import { Link } from '@inertiajs/inertia-react';

export default function ClientSidebar() {
  const {
    key,
    profileId,
    parentRef,
    lastActiveRef,
    isProfileActive,
    activeNavLinkId,
    makeActive,
    incrementKey,
  } = useClientSidebar();

  return (
    <div
      id="layoutDrawer_nav"
      className="bg-info border-end c-border-info-dark"
    >
      <nav className="drawer border-0">
        <div className="drawer-menu pt-4">
          <div className="h-100 d-flex flex-column justify-content-between">
            <div ref={parentRef} id="mainParent" key={key}>
              {navLinks.map((navLink, index) => (
                <NavLink
                  key={index}
                  data={navLink}
                  level={1}
                  parent={parentRef}
                  {...{
                    activeNavLinkId,
                    makeActive,
                    lastActiveRef,
                    incrementKey,
                  }}
                />
              ))}
            </div>

            <div>
              <Link
                className={`d-flex gap-2 c-new-nav-link c-level-1  ${isProfileActive ? 'c-new-nav-link-active' : ''}`}
                href={reverseUrl('cl-change-password')}
                onClick={() => {
                  incrementKey();
                  makeActive(profileId);
                }}
              >
                <i className="material-icons">account_circle</i>
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
