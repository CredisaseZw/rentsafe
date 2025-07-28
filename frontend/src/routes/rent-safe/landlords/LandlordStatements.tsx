import GlobalSummaryCard from "@/components/general/globalSummaryCard";
import { User, Building, BadgeCent, Send } from "lucide-react";
import Button from "@/components/general/Button";
import PropertyStatementContainer from "@/components/general/PropertyStatementContainer";
import Header from "@/components/general/Header";

function LandlordStatements() {
   // let {_} = useLandlordStatement();

   return (
      <div className="">
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <GlobalSummaryCard
               value="10"
               subTitle="Landlords"
               layoutScheme={{
                  icon: User,
                  color: "green",
               }}
            />
            <GlobalSummaryCard
               value="15"
               subTitle="Properties"
               layoutScheme={{
                  icon: Building,
                  color: "amber",
               }}
            />
            <GlobalSummaryCard
               valueAsChild={true}
               value={
                  <div className="flex flex-col gap-2">
                     <span className="text-md font-semibold text-gray-700">US$36,366,3</span>
                     <span className="text-md font-semibold text-gray-700">ZWL$36,366,3</span>
                  </div>
               }
               subTitle="Rent Owing"
               layoutScheme={{
                  icon: BadgeCent,
                  color: "purple",
               }}
            />
         </div>

         <div className="flex w-full justify-center">
            <div className="border-color card mt-10 h-fit w-fit rounded-xl p-5">
               <h1 className="text-center text-2xl font-bold text-gray-700 dark:text-gray-200">Selection</h1>
               <div className="mt-5 flex justify-center">
                  <form method="post" className="w-[800px]">
                     <div className="flex w-full flex-row justify-between gap-5">
                        <div className="flex w-1/2 flex-row gap-3">
                           <h6 className="self-center font-bold">Landlord</h6>

                           <div className="flex flex-1 flex-row gap-2">
                              <label htmlFor="" className="self-center">
                                 From:
                              </label>
                              <select required name="from" id="" className="input-default w-full">
                                 <option value="" selected>
                                    All
                                 </option>
                              </select>
                           </div>
                        </div>

                        <div className="flex w-1/2 flex-row gap-2">
                           <label htmlFor="" className="self-center">
                              To:
                           </label>
                           <select required name="to" id="" className="input-default w-full">
                              <option value="" selected>
                                 All
                              </option>
                           </select>
                        </div>
                     </div>
                     <div className="mt-10 flex w-full flex-row justify-between gap-3">
                        <div className="flex w-1/2 flex-row gap-3">
                           <h6 className="self-center font-bold">Property</h6>

                           <div className="flex flex-1 flex-row gap-2">
                              <label htmlFor="" className="self-center">
                                 From:
                              </label>
                              <select required name="pfrom" id="" className="input-default w-full">
                                 <option value="" selected>
                                    All
                                 </option>
                              </select>
                           </div>
                        </div>

                        <div className="flex w-1/2 flex-row gap-2">
                           <label htmlFor="" className="self-center">
                              To:
                           </label>
                           <select required name="pto" id="" className="input-default w-full">
                              <option value="" selected>
                                 All
                              </option>
                           </select>
                        </div>
                     </div>
                     <div className="mt-10 flex w-full flex-row justify-between gap-5">
                        <div className="flex w-1/4 flex-row gap-3">
                           <h6 className="self-center font-bold">Year</h6>

                           <select required name="year" id="" className="input-default w-full">
                              <option value="" selected>
                                 2025
                              </option>
                           </select>
                        </div>
                        <div className="flex w-1/4 flex-row gap-2">
                           <label htmlFor="" className="self-center font-bold">
                              Month
                           </label>
                           <select required name="month" id="" className="input-default w-full">
                              <option value="" selected>
                                 All
                              </option>
                           </select>
                        </div>
                        <div className="flex w-1/4 flex-row gap-3">
                           <h6 className="self-center font-bold">Currency</h6>

                           <select required name="year" id="" className="input-default w-full">
                              <option value="USD" selected>
                                 USD
                              </option>
                              <option value="ZWD" selected>
                                 USD
                              </option>
                           </select>
                        </div>
                     </div>
                     <div className="mt-5 flex flex-row justify-end">
                        <Button type="submit" className="flex flex-row gap-3">
                           <Send size={18} className="self-center" />
                           Submit
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         <div className="main-card mt-10 min-h-[25vh] w-full rounded-xl p-5 shadow">
            <Header title="Landlord Property Statements" />
            <PropertyStatementContainer />
         </div>
      </div>
   );
}

export default LandlordStatements;
