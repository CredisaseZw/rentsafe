import type { BranchPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";
import type { BranchCreationResponse } from "@/interfaces";
import { stringifyAndFmt } from "@/lib/utils";

export default function useCreateBranch(successCallback?: () => void) {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: (branchPayload: BranchPayload) => api.post<BranchCreationResponse>("/api/branches/", branchPayload).then((res) => res.data),
      onError(error: AxiosError | Error | unknown) {
         console.error("Error creating branch:", error);
         if (isAxiosError(error))
            return toast.error("Failed to create branch", {
               description: error.response?.data.error || error.response?.data.details || "Something went wrong. Please try again.",
            });
         toast.error("Failed to create branch. Please try again.", { description: stringifyAndFmt(error) });
      },
      onSuccess() {
         client.invalidateQueries({ queryKey: ["company-branches"], exact: false });
         toast.success("Branch created successfully!");
         if (successCallback) successCallback();
      },
   });

   return { isPending, createBranch: mutate };
}
