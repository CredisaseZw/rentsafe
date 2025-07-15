import BaseTable, { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import { Fullscreen, UserPlus, UserSearch } from "lucide-react";
import SectionHeading from "@/components/general/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentStatusReport from "./PaymentStatusReport";

export default function IndividualPaymentStatusTab() {
   const rows: BaseTableRow[] = [
      {
         forenames: "John",
         surname: "Doe",
         identificationNumber: "123456789",
      },
      {
         forenames: "Jane",
         surname: "Smith",
         identificationNumber: "987654321",
      },
      {
         forenames: "Alice",
         surname: "Johnson",
         identificationNumber: "456789123",
      },
      {
         forenames: "Bob",
         surname: "Brown",
         identificationNumber: "321654987",
      },
      {
         forenames: "Charlie",
         surname: "Davis",
         identificationNumber: "789123456",
      },
      {
         forenames: "Eve",
         surname: "Wilson",
         identificationNumber: "654321789",
      },
      {
         forenames: "Frank",
         surname: "Garcia",
         identificationNumber: "159753486",
      },
      {
         forenames: "Grace",
         surname: "Martinez",
         identificationNumber: "753159852",
      },
      {
         forenames: "Hank",
         surname: "Lopez",
         identificationNumber: "951357468",
      },
      {
         forenames: "Ivy",
         surname: "Gonzalez",
         identificationNumber: "357951246",
      },
   ].map((cell) => ({
      ...cell,
      select: (
         <PaymentStatusReport
            trigger={
               <Button variant="outline" size="xs">
                  View <Fullscreen size={16} />
               </Button>
            }
            report={{}}
         />
      ),
   }));

   const headers: BaseTableColumn[] = [
      { name: "forenames", displayName: "Forenames" },
      { name: "surname", displayName: "Surname" },
      { name: "identificationNumber", displayName: "Identification Number" },
      { name: "select", displayName: "", colGroupclassName: "w-[1%]" },
   ];

   function handleSearch(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = formData.get("q") as string;
      console.log(`Searching for: ${query}`);
   }

   return (
      <div>
         <SectionHeading>Search Individual</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            tableActions={
               <div className="flex items-center justify-between gap-2">
                  <form
                     onSubmit={handleSearch}
                     className="bg-background border-foreground/40 flex items-center rounded-sm border"
                  >
                     <UserSearch size={20} className="mx-2" />
                     <Input
                        placeholder="Search by name or ID..."
                        name="q"
                        minLength={2}
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 focus-visible:ring-0"
                     />
                  </form>
                  <Button size="sm">
                     Add New Individual <UserPlus />
                  </Button>
               </div>
            }
         />
      </div>
   );
}
