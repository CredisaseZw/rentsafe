import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/general/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Plus, UserRoundPlus } from "lucide-react";
import useAddIndividualLease from "@/hooks/components/useAddIndividualLease";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useState } from "react";
import type { Option } from "@/types";
import AddLeaseForm from "@/components/forms/AddLeaseForm";
import { capitalizeFirstLetter } from "@/lib/utils";

function ActivateLease() {
    const {isOpen, setShowModal} = useAddIndividualLease();
    const leaseModes = useRef<Option[]>([
        {label : "Individual", value : "individual"},
        {label : "Company", value : "company"},

    ])
    const [clientType, setClientType] = useState("individual")
    const successCallback = ()=>{ setShowModal(false)}    
    const tabs = [
        {
         icon: UserRoundPlus,
         value: "single",
         label: "Single",
         content: <AddLeaseForm clientType= {clientType} successCallback = {successCallback}/>,
        },
        {
         icon: Layers,
         value: "multiple",
         label: "Multiple",
         content: <div>Multiple</div>,
        },
    ]
    return (
        <Dialog
            modal
            open = {isOpen}
            onOpenChange={setShowModal}
        >
            <DialogTrigger asChild>
                <Button asChild>
                    Activate a new lease <Plus size={18} />
                </Button>
            </DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[1010px] sm:max-w-[default] p-7 max-h-[90vh] overflow-y-auto overflow-x-auto`}>
                <DialogTitle>Add Lease - {capitalizeFirstLetter(clientType)}</DialogTitle>
                <div className="mt-3">
                    <Tabs defaultValue={tabs[0].value} className="w-full">
                        <TabsList className="flex gap-3">
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 self-center w-[170px]">Tenant Type:</span>
                                <Select name="leaseStatus" defaultValue={leaseModes.current[0].value} onValueChange={(val)=> setClientType(val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select ..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            leaseModes.current.map((status: Option, index: number)=>
                                                <SelectItem value={status.value} key={index}>{status.label}</SelectItem>
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={`border-color cursor-pointer border px-4 py-5 text-gray-800 transition-none hover:bg-gray-100 data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:text-white hover:dark:bg-zinc-900 data-[state=active]:dark:bg-zinc-900`}
                                >
                                    <tab.icon />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        
                        </TabsList>
                        <div>
                            {tabs.map((tab) => (
                                <TabsContent key={tab.value} value={tab.value}>
                                    {tab.content}
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
   
  )
}

export default ActivateLease