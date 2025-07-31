import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type React from "react";
import LoadingIndicator from "./LoadingIndicator";
interface TableBaseProps {
   isLoading?: false | true;
   headers?: { name: string; textAlign?: string; className?: string; colSpan?: number }[];
   children: React.ReactNode;
   headerClass?: string;
}

export function TableBase({ isLoading, headers = [], children, headerClass }: TableBaseProps) {
   return (
      <Table className="border-color rounded border">
         <TableHeader className={`bg-gray-100 dark:bg-zinc-900 ${headerClass}`}>
            <TableRow>
               {headers.map((header, index) => (
                  <TableHead
                     colSpan={header?.colSpan}
                     key={index}
                     className={`text-${header.textAlign} px-4 py-5 font-bold ${header.className}`}
                  >
                     {header.name}
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {isLoading ? (
               <TableRow>
                  <TableCell colSpan={headers.length}>
                     <div className="flex items-center justify-center py-4">
                        <LoadingIndicator />
                     </div>
                  </TableCell>
               </TableRow>
            ) : (
               children
            )}
         </TableBody>
      </Table>
   );
}
