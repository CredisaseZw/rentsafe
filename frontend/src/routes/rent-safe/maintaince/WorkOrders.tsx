import Button from "@/components/general/Button";
import GlobalSummaryCard from "@/components/general/globalSummaryCard";
import Header from "@/components/general/Header";
import Searchbox from "@/components/general/Searchbox";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import { CheckCheck, CircleDashed, Combine, PackageOpen, Plus, Timer } from "lucide-react";

////
import Pill from "@/components/general/Pill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useWorkOrders from "@/hooks/components/useWorkOrders";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function WorkOrders() {
   const { workOrderOptions, setWorkOrder } = useWorkOrders();

   return (
      <div className="">
         <Header title="Work Orders Managament" />
         <ColumnsContainer numberOfCols={5}>
            <GlobalSummaryCard
               value={"15"}
               subTitle="All Orders"
               layoutScheme={{
                  icon: Combine,
                  color: "red",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Open"
               layoutScheme={{
                  icon: PackageOpen,
                  color: "blue",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="In progress"
               layoutScheme={{
                  icon: CircleDashed,
                  color: "amber",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Scheduled"
               layoutScheme={{
                  icon: Timer,
                  color: "purple",
               }}
            />
            <GlobalSummaryCard
               value={"10"}
               subTitle="Completed"
               layoutScheme={{
                  icon: CheckCheck,
                  color: "green",
               }}
            />
         </ColumnsContainer>
         <div className="mt-5">
            <div className="main-card">
               <div className="flex flex-row justify-between">
                  <Searchbox
                     placeholder="Work order ID..."
                     handleSearch={(text) => {
                        console.log(text);
                     }}
                  />
                  <Button asChild>
                     <Plus size={18} />
                     New Work Order
                  </Button>
               </div>
               <ColumnsContainer numberOfCols={2}>
                  <div className="card mt-5">
                     <div className="flex flex-row gap-3 self-center">
                        <h6 className="self-center">#WO-2025-002</h6>
                        <Pill variant={"danger"}>High</Pill>
                        <div>
                           <Select
                              onValueChange={(value) =>
                                 setWorkOrder({
                                    id: "",
                                    selectedOption: value,
                                 })
                              }
                           >
                              <SelectTrigger className="w-[180px]">
                                 <SelectValue placeholder={workOrderOptions.current["open"]} />{" "}
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="open">
                                    <Tooltip>
                                       <TooltipTrigger>Open</TooltipTrigger>
                                       <TooltipContent>
                                          <p>Request for repairs</p>
                                       </TooltipContent>
                                    </Tooltip>
                                 </SelectItem>
                                 <SelectItem value="scheduled">
                                    <Tooltip>
                                       <TooltipTrigger>Scheduled</TooltipTrigger>
                                       <TooltipContent>
                                          <p>Requested of payer</p>
                                       </TooltipContent>
                                    </Tooltip>
                                 </SelectItem>
                                 <SelectItem value="in_progress">
                                    <Tooltip>
                                       <TooltipTrigger> In Progress</TooltipTrigger>
                                       <TooltipContent>
                                          <p>Work started</p>
                                       </TooltipContent>
                                    </Tooltip>
                                 </SelectItem>
                                 <SelectItem value="completed">
                                    <Tooltip>
                                       <TooltipTrigger> Completed</TooltipTrigger>
                                       <TooltipContent>
                                          <p>Work Completed</p>
                                       </TooltipContent>
                                    </Tooltip>
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     <div className="mt-5">
                        <h4 className="font-bold">Kitchen Sink Leak</h4>
                        <p className="mt-2">
                           Water is dripping from under the kitchen sink. The leak appears to be coming from the pipe
                           connection
                        </p>
                     </div>
                     <div className="mt-5"></div>
                  </div>
               </ColumnsContainer>
            </div>
         </div>
      </div>
   );
}

export default WorkOrders;
