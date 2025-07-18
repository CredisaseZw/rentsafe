import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fullscreen, Search } from "lucide-react";
import BaseTable, { type BaseTableColumn, type BaseTableRow } from "@/components/general/BaseTable";
import CompanyPaymentStatusReport from "./CompanyPaymentStatusReport";
import SectionHeading from "@/components/general/SectionHeading";
import CompanyForm from "./CompanyForm";

export default function CompanyPaymentStatusTab() {
   const rows: BaseTableRow[] = [
      {
         registeredName: "Tech Solutions Ltd",
         registrationNumber: "123456789",
      },
      {
         registeredName: "Innovatech Corp",
         registrationNumber: "987654321",
      },
      {
         registeredName: "Global Enterprises",
         registrationNumber: "456789123",
      },
      {
         registeredName: "Future Tech Inc",
         registrationNumber: "321654987",
      },
      {
         registeredName: "Smart Innovations",
         registrationNumber: "789123456",
      },
   ].map((cell) => ({
      ...cell,
      select: (
         <CompanyPaymentStatusReport
            trigger={
               <Button variant="outline" size="xs">
                  View <Fullscreen size={16} />
               </Button>
            }
            report={sampleReport}
         />
      ),
   }));

   const headers: BaseTableColumn[] = [
      { name: "registeredName", displayName: "Registered Name" },
      { name: "registrationNumber", displayName: "Registration Number" },
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
         <SectionHeading>Search Company</SectionHeading>
         <BaseTable
            headers={headers}
            rows={rows}
            tableActions={
               <div className="flex items-center justify-between gap-2">
                  <form
                     onSubmit={handleSearch}
                     className="bg-background border-foreground/40 flex items-center rounded-sm border"
                  >
                     <Search size={20} className="mx-2" />
                     <Input
                        placeholder="Search by name or reg..."
                        name="q"
                        minLength={2}
                        required
                        className="h-fit max-w-[400px] rounded-none border-none bg-transparent px-0 focus-visible:ring-0"
                     />
                  </form>
                  <CompanyForm />
               </div>
            }
         />
      </div>
   );
}

const sampleReport = {
   claims: [
      { claimant: "John Doe", type: "Rent", currency: "USD", amount: 500, dateOfClaim: "2023-01-10" },
      { claimant: "Jane Smith", type: "Deposit", currency: "USD", amount: 300, dateOfClaim: "2023-02-20" },
   ],
   active: [
      { creditor: "Landlord A", type: "Residential", outstandingSince: "2023-03-01", amount: 200 },
      { creditor: "Landlord B", type: "Commercial", outstandingSince: "2023-04-15", amount: 1000 },
   ],
   historic: [
      { creditor: "Landlord C", type: "Residential", outstandingSince: "2022-05-10", amount: 150 },
      { creditor: "Landlord D", type: "Commercial", outstandingSince: "2021-08-20", amount: 800 },
   ],
   rating: "Non payer",
   companyDetails: {
      registeredName: "Tech Solutions Ltd",
      tradingName: "Tech Solutions",
      registrationNumber: "123456789",
      dateOfRegistration: "2020-01-01",
      tradingStatus: "Active",
      industrySector: "Information Technology",
      telephoneNumber: "071 123 4567",
      mobileNumber: "071 123 4567",
      email: "info@techsolutions.com",
      website: "www.techsolutions.com",
      address: "123 Main St, Harare, Zimbabwe",
   },
};
