import Logo from "@/components/general/Logo";
import OverviewCard from "./OverviewCard";
import { useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import { formatErrorMessage, friendlyDate } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertTriangle, Fullscreen, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import LoadingIndicator from "@/components/general/LoadingIndicator";
import useCompanyPaymentStatusReport from "@/hooks/pages/dashboard/useCompanyPaymentStatusReport";
import { useReactToPrint } from "react-to-print";

export default function CompanyPaymentStatusReport({ branchID }: { branchID: number }) {
   const { error, show, report, isLoading, ratingColor, showFullAddress, handleOpenChange, setShowFullAddress } =
      useCompanyPaymentStatusReport(branchID);

   const componentRefence = useRef<HTMLDivElement>(null);
   const expandAddress = useRef<HTMLButtonElement>(null);

   const onDownloadPDF = useReactToPrint({
      contentRef: componentRefence,
      documentTitle: `REPORT_${report.branchDetails.branchName}_-_${new Date().toISOString()}`,
      pageStyle: `
               @page {
                  margin: 0.3in;
               }
                  
               body {
                     margin: 0;
                     padding: 0;
               }
            `,
   });

   return (
      <Dialog modal open={show} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button variant="outline" size="xs">
               View <Fullscreen size={16} />
            </Button>
         </DialogTrigger>

         <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[1100px] sm:max-w-[default]`}>
            <DialogTitle>
               <Button size="sm" onClick={onDownloadPDF}>
                  Print
                  <Printer />
               </Button>
            </DialogTitle>

            <div className="h-[80vh] overflow-auto p-8 text-sm" ref={componentRefence}>
               <div className="mb-10 flex justify-between gap-3">
                  <div>
                     <Logo className="w-fit text-xl" imageClassName="w-4" />
                     <p>Securing you rental investments</p>
                     <p>
                        Rent Payment Status Report on{" "}
                        <span className="font-semibold">{report?.branchDetails.registrationName}</span> as at{" "}
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
                        <OverviewCard
                           label="Classification"
                           value={report?.rating || "N/A"}
                           valueClassName={ratingColor}
                        />
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
                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Registered Name</div>

                              <div className="col-span-3">{report?.branchDetails.registrationName}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Trading Name</div>

                              <div className="col-span-3">{report?.branchDetails.tradingName}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Registration Number</div>

                              <div className="col-span-3">{report?.branchDetails.registrationNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Date Of Registration</div>

                              <div className="col-span-3">
                                 {report?.branchDetails.dateOfRegistration
                                    ? friendlyDate(report?.branchDetails.dateOfRegistration)
                                    : "N/A"}
                              </div>
                           </div>

                           <div className="grid grid-cols-5 items-start gap-2 px-3 py-1">
                              <div className="col-span-2">Trading Status</div>

                              <div className="col-span-3">{report?.branchDetails.tradingStatus}</div>
                           </div>
                        </div>

                        <div className="border-foreground/30 border-x border-b">
                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Mobile Number</div>

                              <div className="col-span-3">{report?.branchDetails.mobileNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Telephone No</div>

                              <div className="col-span-3">{report?.branchDetails.telephoneNumber}</div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Email</div>

                              <div className="col-span-3">
                                 <Link
                                    to={`mailto:${report?.branchDetails.email}`}
                                    className="text-PRIMARY hover:underline"
                                 >
                                    {report?.branchDetails.email}
                                 </Link>
                              </div>
                           </div>

                           <div className="border-foreground/30 grid grid-cols-5 items-start gap-2 border-b px-3 py-1">
                              <div className="col-span-2">Website</div>

                              <div className="col-span-3">
                                 <Link
                                    target="_blank"
                                    to={report?.branchDetails.website || ""}
                                    className="text-PRIMARY hover:underline"
                                 >
                                    {report?.branchDetails.website}
                                 </Link>
                              </div>
                           </div>

                           <div className="grid grid-cols-5 items-start gap-2 px-3 py-1">
                              <div className="col-span-2">Address</div>

                              <div className="col-span-3 flex items-start gap-1">
                                 <div className={showFullAddress ? "grow" : "line-clamp-1 grow"}>
                                    {report?.branchDetails?.address ?? " -"}
                                 </div>
                                 <Button
                                    ref={expandAddress}
                                    onClick={() => setShowFullAddress((prev) => !prev)}
                                    variant="outline"
                                    className="py-0"
                                    size="xs"
                                 >
                                    {showFullAddress ? "-" : "+"}
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </div>
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

                     {report?.claims.map((claim, index) => (
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

                     {report?.active.map((rental, index) => (
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

                     {report?.historic.map((rental, index) => (
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

               {isLoading && (
                  <div className="absolute top-0 left-0 flex size-full items-center justify-center rounded-md bg-white/80 text-black">
                     <LoadingIndicator />
                  </div>
               )}

               {error && (
                  <div className="absolute top-0 left-0 flex size-full items-center justify-center rounded-md bg-white/80 text-center text-black">
                     <div>
                        <AlertTriangle className="mx-auto mb-2" />
                        {formatErrorMessage(error)}
                     </div>
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
