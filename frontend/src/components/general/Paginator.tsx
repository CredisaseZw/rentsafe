import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationData } from "@/interfaces";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Paginator({
   paginationData,
   paginationName,
}: {
   paginationData: PaginationData;
   paginationName: string;
}) {
const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSize = 10;

  const nextPage = paginationData?.next
    ? new URL(paginationData.next).searchParams.get("page")
    : null;

  const previousPage = paginationData?.previous
    ? new URL(paginationData.previous).searchParams.get("page") || "1"
    : null;

  const currentPage = nextPage
    ? parseInt(nextPage) - 1
    : previousPage
    ? parseInt(previousPage) + 1
    : 1;

  const totalPages = Math.ceil((paginationData?.count || 0) / pageSize);

  const goToPage = (page: string | null) => {
    if (!page) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set(paginationName, page);
    navigate({ search: newParams.toString() });
  };


   return (
      <Pagination>
         <PaginationContent>
            {paginationData?.previous && (
               <PaginationItem>
                  <PaginationPrevious
                     to={`?${paginationName}=${previousPage}`}
                     onClick={(e) => {
                        e.preventDefault();
                        goToPage(previousPage);
                     }}
                  />
               </PaginationItem>
            )}

            <PaginationItem>
               <PaginationLink to={""}>
                  <span>
                     {currentPage}
                     {paginationData?.count ? ` / ${totalPages}` : ""}
                  </span>
               </PaginationLink>
            </PaginationItem>

            {paginationData?.next && (
               <PaginationItem>
                  <PaginationNext
                     to={`?${paginationName}=${nextPage}`}
                     onClick={(e) => {
                        e.preventDefault();
                        goToPage(nextPage);
                     }}
                  />
               </PaginationItem>
            )}
         </PaginationContent>
      </Pagination>
   );
}



