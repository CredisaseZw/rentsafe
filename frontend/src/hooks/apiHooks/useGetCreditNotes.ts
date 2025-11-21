import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router";
import { setCreditNoteStore } from "@/store/creditNoteStore";
import type { CreditNote, Response } from "@/interfaces";

interface CreditNotesResponse extends Response {
    results : CreditNote[]
}

export function useGetCreditNotes() {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search");

  if (!search) {
    params.set("page", String(page));
  } else {
    Array.from(params.keys()).forEach(key => {
      if (key !== "search") params.delete(key);
    });
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const { data, isLoading, error, refetch } = useQuery<CreditNotesResponse>({
    queryKey: ["creditNotes", page, query],
    queryFn: async () => {
      const response = await api.get<CreditNotesResponse>(`/api/accounting/credit-notes/${query}`);
      return response.data;
    },
  });
  setCreditNoteStore(refetch);
  return { data, isLoading, error };
}
