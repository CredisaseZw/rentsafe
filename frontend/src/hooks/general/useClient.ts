import { queryClient } from "@/providers/react-query-client";
import { useQueryClient } from "@tanstack/react-query";

export default function useClient() {
   return useQueryClient(queryClient);
}
