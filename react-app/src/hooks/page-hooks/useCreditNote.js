import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

export default function useCreditNote() {
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = usePage();

  function fetchCreditNotes() {
    // setLoading(true);
    // axios
    //   .get("/accounting/credit-note/")
    //   .then((res) => {
    //     console.log(res);
    //     setCreditNotes(res.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   });
  }

  useEffect(() => {
    fetchCreditNotes();
  }, [url]);

  function handleFilters(e) {
    e.preventDefault();
    const year = e.target.year.value;
    const month = e.target.month.value;

    const updatedUrl = new URL(url);
    updatedUrl.searchParams.set("year", year);
    updatedUrl.searchParams.set("month", month);

    Inertia.replace(updatedUrl.href, { preserveState: true });
  }

  return { loading, creditNotes, handleFilters };
}
