import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Plus, UserRoundPlus } from "lucide-react";
import useAddIndividualLease from "@/hooks/components/useAddIndividualLease";
import AddIndividualLease from "@/components/forms/AddIndividualLease";

function ActiveIndividualLease() {
    const {isOpen, setShowModal} = useAddIndividualLease();
    const tabs = [
        {
         icon: UserRoundPlus,
         value: "signle",
         label: "Single",
         content: <AddIndividualLease/>,
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
            <Button>
                Activate Individuals <Plus />
            </Button>
        </DialogTrigger>

        <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`max-w-[1000px] sm:max-w-[default] p-7 max-h-[90vh] overflow-y-auto pr-2`}>
            <DialogTitle>Add Lease - Individual</DialogTitle>
            <div className="mt-3">
                <Tabs defaultValue={tabs[0].value}>
                    <TabsList>
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

export default ActiveIndividualLease