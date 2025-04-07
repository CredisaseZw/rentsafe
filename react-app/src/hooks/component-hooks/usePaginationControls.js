import { useForm, usePage } from "@inertiajs/inertia-react";

export default function usePaginationControls(totalPages) {
  const { get } = useForm();
  const url = new URL(usePage().url);

  function changePage(page) {
    url.searchParams.set("page", page);
    get(url.href, { preserveState: true });
  }
  const currentPage = Number(url.searchParams.get("page") || 1);

  return { pageNums: determineRange(currentPage, totalPages), changePage };
}

function determineRange(currentPage, totalPages) {
  const rangelimit = 10;
  const pageNums = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNums.push(i);
  }

  if (totalPages <= rangelimit) {
    return pageNums;
  } else {
    const startingPageIndex = Math.floor(pageNums.indexOf(currentPage) / rangelimit) * rangelimit;
    const endPageIndex = startingPageIndex + rangelimit;

    return pageNums.slice(startingPageIndex, endPageIndex);
  }
}
