import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationData } from "@/interfaces";

export default function TablePagination({
   paginationData,
   paginationName,
}: {
   paginationData: PaginationData;
   paginationName: string;
}) {
   const nextPage = paginationData?.next ? new URL(paginationData.next).searchParams.get("page") : null;
   const previousPage = paginationData?.previous ? new URL(paginationData.previous).searchParams.get("page") : null;
   const currentPage = nextPage ? parseInt(nextPage) - 1 : previousPage ? parseInt(previousPage) + 1 : 1;

   return (
      <Pagination>
         <PaginationContent>
            {paginationData?.previous && (
               <PaginationItem>
                  <PaginationPrevious to={{ search: `?${paginationName}=${previousPage}` }} />
               </PaginationItem>
            )}

            <PaginationItem>
               <PaginationLink to="">
                  {currentPage}
                  {paginationData?.count ? ` / ${paginationData.count}` : ""}
               </PaginationLink>
            </PaginationItem>

            {paginationData?.next && (
               <PaginationItem>
                  <PaginationNext to={{ search: `?${paginationName}=${nextPage}` }} />
               </PaginationItem>
            )}
         </PaginationContent>
      </Pagination>
   );
}
