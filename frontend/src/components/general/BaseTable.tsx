import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReactNode } from "react";
import LoadingIndicator from "./LoadingIndicator";
import BaseCard from "./BaseCard";
import { cn } from "@/lib/utils";

export type BaseTableColumn = {
   name: string;
   displayName: string;
   colGroupclassName?: string;
};

export type BaseTableRow = { [field: string]: ReactNode };

type BaseTableProps = {
   headers: BaseTableColumn[];
   rows: BaseTableRow[];
   tableActions?: ReactNode;
   title?: string;
   titleClassName?: string;
   isLoading?: boolean;
};

export default function BaseTable({
   title,
   titleClassName,
   headers,
   rows: data,
   tableActions,
   isLoading,
}: BaseTableProps) {
   const mappableRows = data;

   return (
      <BaseCard className="rounded-sm p-3">
         {title && (
            <div
               className={cn(
                  "bg-foreground/10 border-foreground/20 rounded-t-sm border p-0.5 text-center font-semibold",
                  titleClassName,
               )}
            >
               {title}
            </div>
         )}

         <div className="p-1">
            <Table>
               <colgroup>
                  {headers.map((header) => (
                     <col key={header.name} className={header.colGroupclassName} />
                  ))}
               </colgroup>

               <TableHeader stickToTop className="border-color border-b-1 bg-transparent">
                  {tableActions && (
                     <TableRow>
                        <TableHead colSpan={headers.length}>{tableActions}</TableHead>
                     </TableRow>
                  )}
                  <TableRow>
                     {headers.map((header) => (
                        <TableHead key={header.name} className="py-4 font-bold">
                           {header.displayName}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     <TableRow noHover>
                        <TableCell colSpan={headers.length}>
                           <LoadingIndicator />
                        </TableCell>
                     </TableRow>
                  ) : mappableRows.length ? (
                     mappableRows.map((row, index) => (
                        <TableRow key={index} noHover>
                           {headers.map((field) => (
                              <TableCell key={field.name}>{row[field.name]}</TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow noHover>
                        <TableCell colSpan={headers.length} className="text-muted-foreground py-5 text-center">
                           No data
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </BaseCard>
   );
}
