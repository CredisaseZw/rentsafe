import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const invoices = [
   {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
   },
   {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
   },
   {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
   },
   {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
   },
   {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
   },
   {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
   },
   {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
   },
];
const headers = [
   {
      name: "First Name",
      textAlign: "left",
   },
   {
      name: "Last Name",
      textAlign: "left",
   },
   {
      name: "Access Level",
      textAlign: "left",
   },
   {
      name: "Email",
      textAlign: "left",
   },
   {
      name: "Actions",
      textAlign: "center",
   },
];

export function TableBase() {
   return (
      <Table className="border-color rounded border">
         <TableHeader>
            <TableRow>
               {headers.map((header, index) => (
                  <TableHead key={index} className={`text-left ${header.textAlign} px-4 py-5 font-bold`}>
                     {header.name}
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {invoices.map((invoice) => (
               <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
