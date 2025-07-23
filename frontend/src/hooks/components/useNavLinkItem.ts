import { removeTrailingSlash } from "@/lib/utils";
import type { NavLink } from "@/types";
import React from "react";
import { useLocation } from "react-router";

function matchPathRecursive(navLink: NavLink, pathname: string): boolean {
  const currentPath = removeTrailingSlash(navLink.path || "");
  const targetPath = removeTrailingSlash(pathname);
  
  if (currentPath === targetPath) return true;

  if (navLink.subLinks && navLink.subLinks.length > 0) {
    return navLink.subLinks.some(sub => matchPathRecursive(sub, pathname));
  }

  return false;
}

export default function useNavLinkItem(
  navLink: NavLink,
  expandedSegment: string,
  expandThisSegment: (id: string) => void,
) {
  const { pathname } = useLocation();
  const isActive = matchPathRecursive(navLink, pathname);
  const previouslyExpandedSegment = React.useRef(expandedSegment);

  const isOpen = expandedSegment.includes(navLink.segment);

  function handleOpenChange(open: boolean) {
    if (open) {
      previouslyExpandedSegment.current = expandedSegment;
      expandThisSegment(navLink.segment);
    } else {
      expandThisSegment(previouslyExpandedSegment.current);
    }
  }

  return { isActive, isOpen, handleOpenChange };
}
