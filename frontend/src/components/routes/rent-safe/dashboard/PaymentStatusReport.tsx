import Logo from "@/components/general/Logo";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { friendlyDate } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router";
import OverviewCard from "./OverviewCard";
import { PAYMENT_STATUS_CLASSIFICATIONS } from "@/constants";
import BaseTable from "@/components/general/BaseTable";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type ReportDialogProps = {
   trigger: React.ReactNode;
   report: { [key: string]: string | number | boolean };
};

export default function PaymentStatusReport({ trigger }: ReportDialogProps) {
   return (
      <Dialog modal>
         <DialogTrigger asChild>{trigger}</DialogTrigger>

         <DialogContent className="max-w-[1100px] sm:max-w-[default]">
            {/* <DialogTitle className="invisible">Payment Status Report</DialogTitle> */}
            <DialogTitle>
               <Button size="sm">
                  Print
                  <Printer />
               </Button>
            </DialogTitle>

            <div className="h-[80vh] overflow-auto pr-2 text-sm">
               <div className="mb-10 flex justify-between gap-3">
                  <div>
                     <Logo className="w-fit text-xl font-semibold" imageClassName="w-4" />
                     <p>Securing you rental investments</p>
                     <p>
                        Rent Payment Status Report on <span className="font-semibold">Jerad Spiwe</span> as at{" "}
                        <span className="font-semibold">{friendlyDate(new Date())}</span>
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

               <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between gap-2">
                     <div className="w-fit">
                        <OverviewCard
                           label="Payment status classification/indicator"
                           value="Non-payer"
                           valueClassName="bg-black text-white"
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
                     <div className="mb-2 font-semibold underline underline-offset-2">Personal Details</div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="mb-2 underline underline-offset-2">Identification</div>

                           <div>
                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border p-1">
                                 <div>Surname:</div>

                                 <div>Spiwe</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>First Name:</div>

                                 <div>Jerad</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>National ID:</div>

                                 <div>47225912M47</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Date Of Birth:</div>

                                 <div>{friendlyDate(new Date("1990-01-01"))}</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Marital Status:</div>

                                 <div>Single</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Gender:</div>

                                 <div>Male</div>
                              </div>
                           </div>
                        </div>

                        <div>
                           <div className="mb-2 underline underline-offset-2">Contact Details</div>

                           <div>
                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border p-1">
                                 <div>Mobile Number:</div>

                                 <div>+263 71 882 2460</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Telephone No:</div>

                                 <div>+263 71 882 2460</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Address:</div>

                                 <div>123 Main Street, Harare</div>
                              </div>

                              <div className="border-foreground/30 grid grid-cols-2 items-center gap-2 border border-t-0 p-1">
                                 <div>Email:</div>

                                 <div>
                                    <Link to="mailto:jeradspiwe@gmail.com" className="text-PRIMARY hover:underline">
                                       jeradspiwe@gmail.com
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <BaseTable
                        headers={[
                           { name: "employer", displayName: "Employer" },
                           { name: "position", displayName: "Position" },
                           { name: "startDate", displayName: "Start Date" },
                        ]}
                        title="Employment History"
                        rows={[]}
                     />
                  </div>

                  <h2 className="text-center font-semibold">Outstanding Rentals</h2>

                  <BaseTable
                     headers={[
                        // Claimant	Type	Currency	Amount	Date of Claim
                        { name: "claimant", displayName: "Claimant" },
                        { name: "type", displayName: "Type" },
                        { name: "currency", displayName: "Currency" },
                        { name: "amount", displayName: "Amount" },
                        { name: "dateOfClaim", displayName: "Date of Claim" },
                     ]}
                     title="Claims"
                     rows={[]}
                  />

                  <BaseTable
                     headers={[
                        { name: "creditor", displayName: "Creditor" },
                        { name: "type", displayName: "Type" },
                        { name: "outstandingSince", displayName: "Outstanding Since" },
                        { name: "amount", displayName: "Amount" },
                     ]}
                     title="Active"
                     rows={[]}
                  />

                  <BaseTable
                     headers={[
                        { name: "creditor", displayName: "Creditor" },
                        { name: "type", displayName: "Type" },
                        { name: "outstandingSince", displayName: "Outstanding Since" },
                        { name: "amount", displayName: "Amount" },
                     ]}
                     title="Historic"
                     rows={[]}
                  />
               </div>

               <p className="mt-10 mb-2">
                  Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is
                  addressed. Information on this report is valid at the time of enquiry only. If verification is
                  required, please contact us on the details provided above.
               </p>
               <p className="mb-2">Terms and Conditions apply.</p>
               <p className="mb-2">Copyrights © CrediSafe Zimbabwe</p>
               <p>All rights reserved</p>
            </div>
         </DialogContent>
      </Dialog>
   );
}
