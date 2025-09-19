import EmptyResults from "@/components/general/EmptyResults"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import StaticBadge from "@/components/general/StaticBadge"
import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import useGetLeases from "@/hooks/apiHooks/useGetActiveLeases"
import useLeases from "@/hooks/components/useLeases"
import type { PaginationData } from "@/interfaces"
import { riskLevelColorCode, summarizeAddress } from "@/lib/utils"
import type { Lease } from "@/types"
import { isAxiosError } from "axios"
import { useEffect } from "react"
import { toast } from "sonner"

function Terminated() {
  const {
    terminatedHeaders,
    page,
    status,
    search,
    paginationData,
    leases,
    onClearSearch,
    handleOnSearchValue,
    setLeases,
    setPaginationData
  } = useLeases("TERMINATED");


  const {data, isLoading, error} = useGetLeases(page, status, search);

  useEffect(()=>{
    if(isAxiosError(error)){
      console.error(error);
      const message = error.response?.data.error ?? error.response?.data.detail  ?? "Something went wrong"
      toast.error("Failed to fetch leases", { description: message });
      return; 
    }

    if(data){
      setLeases(data.results ?? [])
      setPaginationData(data as PaginationData)
    }
  }, [page, search, status, data, error])
  return (
    <div className="w-full">
      <div>
        <SectionHeader title="Terminated Leases" subTotal={leases?.length || paginationData?.count || 0} total={paginationData?.count || 0} subTitle="terminated leases"/>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4 mt-8">
        <div className="w-full lg:flex-1">
          <Searchbox
            placeholder="Search by Name"
            handleSearch={handleOnSearchValue}
            clearSearch={onClearSearch}
          />
        </div>

        <div className="flex flex-row w-full lg:w-auto gap-3 items-center">
          <p className="m-0 self-center w-[100px] text-gray-600 dark:text-gray-100 text-sm">
            Sort by
          </p>
          <div className="w-full lg:w-full">
            <Select defaultValue="default" >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="rent_owing_asc">Rent Owing asc</SelectItem>
                <SelectItem value="rent_owing_desc">Rent Owing desc</SelectItem>
                <SelectItem value="color_asc">Color (Rent) asc</SelectItem>
                <SelectItem value="color_desc">Color (Rent) desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-3 2xl:mb-15 sm:mb-30">
        <TableBase headers={terminatedHeaders} isLoading = {isLoading} paginationData={paginationData ?? undefined} paginationName="active_page" isError = {Boolean(error)}>
          {
            leases?.length
            ? leases.map((lease:Lease)=>(
              <TableRow key={lease.lease_id}>      
                <TableCell className="text-center">{lease.lease_id}</TableCell>
                <TableCell className="text-center">{lease.tenants[0].tenant_object.full_name}</TableCell>
                <TableCell className="text-center">{(lease.landlord?.landlord_name !== undefined) ? lease.landlord.landlord_name : lease.landlord_opening_balances_data?.[0]?.landlord?.landlord_name}</TableCell>
                <TableCell className="text-center">{lease.unit.property.type ?? "-"}</TableCell>
                <TableCell className="text-center whitespace-normal break-words max-w-[250px]">{summarizeAddress(lease.unit.property.addresses[0])}</TableCell>
                <TableCell>
                  <StaticBadge bgColor={riskLevelColorCode(lease.risk_level_class)}>
                    <span className="text-white font-semibold text-sm py-2"><i>({lease.currency.currency_code})</i> {lease.owing}</span>
                  </StaticBadge>
                </TableCell>
                <TableCell className="text-center">{"DATE OF TERMINATION"}</TableCell>
                <TableCell >
                  <StaticBadge bgColor="bg-blue-600">
                    <Button variant={"ghost"}>Receipt</Button>
                  </StaticBadge>
                </TableCell>

               <TableCell>
                  <StaticBadge bgColor="bg-amber-500">
                    <Button variant={"ghost"}>Renew</Button>
                  </StaticBadge>
                </TableCell>
              
              </TableRow>
            )) : 
            <TableRow>
              <TableCell colSpan={terminatedHeaders.length}>
                <EmptyResults message="No leases registered."/>
              </TableCell>
            </TableRow>
          }
        </TableBase>
      </div>
    </div>
  )
}

export default Terminated


