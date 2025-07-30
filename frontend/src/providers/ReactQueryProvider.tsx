import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./react-query-client";
import type React from "react";

export default function ReactQueryProvider({ children }: React.PropsWithChildren) {
   return (
      <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}
