import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/inertia-react";
import { determineInitial } from "../../utils/jsxUtils.jsx";

export default function useClientSidebar() {
  const parentRef = useRef();
  const lastActiveRef = useRef(undefined);
  const [key, setKey] = useState(1);
  const path = new URL(usePage().url).pathname;
  const [activeNavLinkId, setActiveNavLinkId] = useState(() => determineInitial(path));

  useEffect(() => {
    if (activeNavLinkId === "use-last-last") {
      setActiveNavLinkId(lastActiveRef.current);
    }
  }, [activeNavLinkId]);

  const makeActive = (id) => setActiveNavLinkId(id);
  const profileId = `profileInMainParent`;
  const isProfileActive = profileId === activeNavLinkId;

  return {
    key,
    parentRef,
    profileId,
    lastActiveRef,
    activeNavLinkId,
    isProfileActive,
    makeActive,
    setActiveNavLinkId,
    incrementKey: () => setKey((prev) => prev + 1),
  };
}
