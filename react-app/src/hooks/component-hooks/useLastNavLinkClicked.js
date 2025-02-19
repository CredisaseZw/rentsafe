import { useState, useEffect, useRef } from 'react';
import { activeTrackableClientNavLinks as NAV_LINKS } from '../../constants';
import { usePage } from '@inertiajs/inertia-react';

export default function useLastNavLinkClicked() {
  const lastLastClickedRef = useRef(undefined);
  const [lastClicked, setLastClicked] = useState();
  const [key, setKey] = useState(0);
  const { url } = usePage();
  const path = new URL(url).pathname;

  // useEffect(() => {
  //   setLastClicked(determineInitial(path));
  // }, []);

  useEffect(() => {
    if (lastClicked === 'use-last-last')
      setLastClicked(lastLastClickedRef.current);
  }, [lastClicked]);

  return { lastClicked, setLastClicked, key, setKey, lastLastClickedRef };
}

function determineInitial(path) {
  switch (path) {
    case '/clients/':
    case '/clients/get-':
    case '/clients/companies/':
      return NAV_LINKS.DASHBOARD;
    case '/clients/leases/':
      return NAV_LINKS.SERVICES;
    case '/clients/users/':
      return NAV_LINKS.ADMIN;
    case '/clients/cl-change_password/':
      return NAV_LINKS.PROFILE;
    default:
      return '';
  }
}
