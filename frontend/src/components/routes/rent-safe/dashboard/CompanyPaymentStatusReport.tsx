import Logo from "@/components/general/Logo";
import OverviewCard from "./OverviewCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import { friendlyDate } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type CompanyPaymentStatusReportProps = {
   trigger: React.ReactNode;
   report: {
      employmentHistory: { employer: string; position: string; startDate: string }[];
      claims: { claimant: string; type: string; currency: string; amount: number; dateOfClaim: string }[];
      active: { creditor: string; type: string; outstandingSince: string; amount: number }[];
      historic: { creditor: string; type: string; outstandingSince: string; amount: number }[];
      rating: string;
      companyDetails: {
         registeredName: string;
         tradingName: string;
         registrationNumber: string;
         dateOfRegistration: string;
         tradingStatus: string;
         industrySector: string;
         telephoneNumber: string;
         mobileNumber: string;
         email: string;
         website: string;
         address: string;
      };
   };
};

export default function CompanyPaymentStatusReport({ trigger, report }: CompanyPaymentStatusReportProps) {
   const { employmentHistory, claims, active, historic, companyDetails, rating } = report;

   const ratingColor =
      PAYMENT_STATUS_CLASSIFICATIONS.find((c) => c.label.toLowerCase() === rating.toLowerCase())?.className ||
      "bg-gray-500 text-white";

   return (
      <Dialog modal>
         <DialogTrigger asChild>{trigger}</DialogTrigger>

         <DialogContent className="max-w-[1100px] sm:max-w-[default]">
            <DialogTitle>
               <Button size="sm">
                  Print
                  <Printer />
               </Button>
            </DialogTitle>

            <div className="h-[80vh] overflow-auto p-8 text-sm">
               <div className="mb-10 flex justify-between gap-3">
                  <div>
                     <Logo className="w-fit text-xl" imageClassName="w-4" />
                     <p>Securing you rental investments</p>
                     <p>
                        Rent Payment Status Report on{" "}
                        <span className="font-semibold">{companyDetails.tradingName}</span> as at{" "}
                        <span className="">{friendlyDate(new Date())}</span>
                     </p>
                  </div>

                  <div className="text-right">
                     +263 71 882 2460
                     <br />
                     <Link to="mailto:credisafezw@gmail.com" className="text-PRIMARY hover:underline">
                        credisafezw@gmail.com
                     </Link>
                     <br />
                     <Link target="_blank" to="https://credi-safe.com" className="text-PRIMARY hover:underline">
                        www.credi-safe.com
                     </Link>
                  </div>
               </div>

               <div className="flex flex-col gap-10">
                  <div className="flex items-center justify-between gap-2">
                     <div className="w-fit">
                        <OverviewCard label="Classification" value={rating} valueClassName={ratingColor} />
                     </div>

                     <div className="flex flex-wrap items-center gap-4">
                        {PAYMENT_STATUS_CLASSIFICATIONS.map((classification) => (
                           <div key={classification.label} className="flex items-center gap-2">
                              <div className={`size-4 rounded-full ${classification.className}`} />
                              <div>{classification.label}</div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <div className="bg-foreground/5 border-foreground/20 border border-b-0 p-0.5 text-center">
                        Company Details
                     </div>

                     <div className="grid grid-cols-2">
                        <div className="border-foreground/30 border-x border-b">
                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Registered Name</div>

                              <div>{companyDetails.registeredName}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Trading Name</div>

                              <div>{companyDetails.tradingName}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Registration Number</div>

                              <div>{companyDetails.registrationNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Date Of Registration</div>

                              <div>{friendlyDate(companyDetails.dateOfRegistration)}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Trading Status</div>

                              <div>{companyDetails.tradingStatus}</div>
                           </div>
                        </div>

                        <div className="border-foreground/30 border-x border-b">
                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Mobile Number</div>

                              <div>{companyDetails.mobileNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Telephone No</div>

                              <div>{companyDetails.telephoneNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-2 items-start gap-2 border-b px-3 py-1">
                              <div>Email</div>

                              <div>
                                 <Link to={`mailto:${companyDetails.email}`} className="text-PRIMARY hover:underline">
                                    {companyDetails.email}
                                 </Link>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 items-start gap-2 px-3 py-1">
                              <div>Website</div>

                              <div>
                                 <Link to={companyDetails.website} className="text-PRIMARY hover:underline">
                                    {companyDetails.website}
                                 </Link>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 items-start gap-2 px-3 py-1">
                              <div>Address</div>

                              <div>{companyDetails.address}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <div className="bg-foreground/5 border-foreground/20 border p-0.5 text-center">
                        Employment History
                     </div>

                     <div className="border-foreground/30 grid grid-cols-3 items-center gap-2 border border-t-0 p-1 text-center font-semibold">
                        <div>Employer</div>
                        <div>Position</div>
                        <div>Start Date</div>
                     </div>

                     {employmentHistory.map((employment, index) => (
                        <div
                           key={index}
                           className="border-foreground/30 grid grid-cols-3 items-center gap-2 border border-t-0 p-1 text-center"
                        >
                           <div>{employment.employer}</div>
                           <div>{employment.position}</div>
                           <div>{friendlyDate(new Date(employment.startDate))}</div>
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center gap-2 text-center font-bold">
                     <div className="bg-foreground h-0.5 grow" />
                     Outstanding Rentals
                     <div className="bg-foreground h-0.5 grow" />
                  </div>

                  <div>
                     <div className="bg-foreground/5 border-foreground/20 border p-0.5 text-center">Claims</div>

                     <div className="border-foreground/30 grid grid-cols-5 items-center gap-2 border border-t-0 p-1 text-center font-semibold">
                        <div>Claimant</div>
                        <div>Type</div>
                        <div>Currency</div>
                        <div>Amount</div>
                        <div>Date of Claim</div>
                     </div>

                     {claims.map((claim, index) => (
                        <div
                           key={index}
                           className="border-foreground/30 grid grid-cols-5 items-center gap-2 border border-t-0 p-1 text-center"
                        >
                           <div>{claim.claimant}</div>
                           <div>{claim.type}</div>
                           <div>{claim.currency}</div>
                           <div>{claim.amount}</div>
                           <div>{friendlyDate(new Date(claim.dateOfClaim))}</div>
                        </div>
                     ))}
                  </div>

                  <div>
                     <div className="bg-foreground/5 border-foreground/20 border p-0.5 text-center">Active</div>

                     <div className="border-foreground/30 grid grid-cols-4 items-center gap-2 border border-t-0 p-1 text-center font-semibold">
                        <div>Creditor</div>
                        <div>Type</div>
                        <div>Outstanding Since</div>
                        <div>Amount</div>
                     </div>

                     {active.map((rental, index) => (
                        <div
                           key={index}
                           className="border-foreground/30 grid grid-cols-4 items-center gap-2 border border-t-0 p-1 text-center"
                        >
                           <div>{rental.creditor}</div>
                           <div>{rental.type}</div>
                           <div>{friendlyDate(new Date(rental.outstandingSince))}</div>
                           <div>{rental.amount}</div>
                        </div>
                     ))}
                  </div>

                  <div>
                     <div className="bg-foreground/5 border-foreground/20 border p-0.5 text-center">Historic</div>

                     <div className="border-foreground/30 grid grid-cols-4 items-center gap-2 border border-t-0 p-1 text-center font-semibold">
                        <div>Creditor</div>
                        <div>Type</div>
                        <div>Outstanding Since</div>
                        <div>Amount</div>
                     </div>

                     {historic.map((rental, index) => (
                        <div
                           key={index}
                           className="border-foreground/30 grid grid-cols-4 items-center gap-2 border border-t-0 p-1 text-center"
                        >
                           <div>{rental.creditor}</div>
                           <div>{rental.type}</div>
                           <div>{friendlyDate(new Date(rental.outstandingSince))}</div>
                           <div>{rental.amount}</div>
                        </div>
                     ))}
                  </div>

                  <div className="mb-20 flex flex-col gap-4">
                     <p>
                        Disclaimer: This report is confidential and intended solely for the individual or entity to whom
                        it is addressed. Information on this report is valid at the time of enquiry only. If
                        verification is required, please contact us on the details provided above.
                     </p>
                     <p>Terms and Conditions apply.</p>
                     <p>Copyrights © CrediSafe Zimbabwe</p>
                     <p>All rights reserved</p>
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
