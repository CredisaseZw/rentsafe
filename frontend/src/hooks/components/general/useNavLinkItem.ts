import { removeTrailingSlash } from "@/lib/utils";
import type { NavLink } from "@/types";
import React from "react";
import { useLocation } from "react-router";

export default function useNavLinkItem(
   navLink: NavLink,
   expandedSegment: string,
   expandThisSegment: (id: string) => void,
) {
   const { pathname } = useLocation();
   const isActive = removeTrailingSlash(pathname) === removeTrailingSlash(navLink.path || "");
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
