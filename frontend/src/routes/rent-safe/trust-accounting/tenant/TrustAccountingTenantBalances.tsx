import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import TenantBalancesByLandlord from "@/components/routes/rent-safe/trust-accounting/tenants/tenant-balances/TenantBalancesByLandlord"
import TenantBalancesCombined from "@/components/routes/rent-safe/trust-accounting/tenants/tenant-balances/TenantBalancesCombined"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"
import { useState } from "react"

interface TABS_LIST_PROPS {
    label: string,
    value: string,
    component: React.ReactNode;
}

function TrustAccountingTenantBalances() {
    const TABS_LIST:TABS_LIST_PROPS[] = [
        {
            label : "Combined",
            value : "combined",
            component : <TenantBalancesCombined/>
        },
        {
            label : "By Landlord",
            value : "by-landlord",
            component : <TenantBalancesByLandlord/>
        },

    ]
    const [selectedMode, setSelectedMode] = useState(TABS_LIST[0].value);
    return (
    <div>
        <Header title="Tenant Balances"/>
        <div className="main-card">
            <Tabs defaultValue={selectedMode} onValueChange={(value)=> setSelectedMode(value)}>
                <ColumnsContainer numberOfCols={2} marginClass="">
                    <div>
                        <SectionHeader
                            title= {selectedMode === "combined" ?  "Combined Balances" : "Landlord Balances"}
                            subTitle={selectedMode === "combined" ?  "combined balances" : "landlord balances"}
                            total={0}
                            subTotal={0}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                        <div className="flex h-full">
                            <div className=" flex h-full self-center">
                                <Searchbox
                                    placeholder="Search by name"
                                />
                            </div>
                        </div>
                        <TabsList className="h-fit gap-3 bg-zinc-100 dark:bg-zinc-900 rounded-md px-2 py-2 flex flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar">
                            {TABS_LIST.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex
                                items-center border-color
                                cursor-pointer border
                                px-2 py-1.5 text-sm
                                text-gray-800 transition-none
                                bg-white dark:bg-zinc-900
                                hover:bg-gray-100 
                                data-[state=active]:bg-gray-800 
                                data-[state=active]:text-white 
                                dark:text-white hover:dark:bg-zinc-900
                                data-[state=active]:dark:bg-zinc-800 
                                whitespace-nowrap"
                            >
                                <span>{tab.label}</span>
                            </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </ColumnsContainer>    
                <div className="mt-5">
                    {
                        TABS_LIST.map((tab, idx)=>(
                            <TabsContent value={tab.value} key={idx}>{tab.component}</TabsContent>
                        ))
                    }
                </div>
            </Tabs>
        </div>
    </div>
  )
}

export default TrustAccountingTenantBalances