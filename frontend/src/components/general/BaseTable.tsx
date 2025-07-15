import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReactNode } from "react";
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
};

export default function BaseTable({ title, titleClassName, headers, rows: data, tableActions }: BaseTableProps) {
   const mappableRows = data;

   return (
      <BaseCard className="rounded-sm p-0">
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

               <TableHeader stickToTop className="border-foreground border-b-2">
                  {tableActions && (
                     <TableRow>
                        <TableHead colSpan={headers.length}>{tableActions}</TableHead>
                     </TableRow>
                  )}
                  <TableRow>
                     {headers.map((header) => (
                        <TableHead key={header.name} className="font-semibold">
                           {header.displayName}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {mappableRows.map((row, index) => (
                     <TableRow key={index} noHover>
                        {headers.map((field) => (
                           <TableCell key={field.name}>{row[field.name]}</TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </BaseCard>
   );
}
