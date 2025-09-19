import EmptyResults from "@/components/general/EmptyResults"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
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
import { summarizeAddress } from "@/lib/utils"
import { isAxiosError } from "axios"
import { useEffect } from "react"
import { toast } from "sonner"
import TerminateLeaseDialog from "./TerminateLeaseDialog"
import type { Lease } from "@/types"
import StaticBadge from "@/components/general/StaticBadge"

function ForRenewal() {
  const {
    renewalHeaders,
    page,
    status,
    search,
    paginationData,
    leases,
    handleOnSearchValue,
    onClearSearch,
    setLeases,
    setPaginationData
  } = useLeases("RENEW")

  const {data, isLoading, error, refetch} = useGetLeases(page, status, search);

  useEffect(()=>{
    if(isAxiosError(error)){
      const message = error.response?.data.error ?? error.response?.data.detail  ?? "Something went wrong"
      toast.error("Failed to fetch leases", { description: message});
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
        <SectionHeader title="Renew Leases" subTotal={leases?.length || paginationData?.count || 0} total={paginationData?.count || 0} subTitle="leases"/>
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
        <TableBase headers={renewalHeaders} isLoading = {isLoading} paginationData={paginationData ?? undefined} paginationName="renew_page" isError = {Boolean(error)}>
          {
            leases?.length
            ? leases.map((lease:Lease)=> (
                <TableRow>      
                  <TableCell className="text-center">{lease.lease_id}</TableCell>
                  <TableCell className="text-center">{lease.tenants[0].tenant_object.full_name}</TableCell>
                  <TableCell className="text-center">{(lease.landlord?.landlord_name !== undefined) ? lease.landlord.landlord_name : lease.landlord_opening_balances_data?.[0]?.landlord?.landlord_name}</TableCell>
                  <TableCell className="text-center">{lease.unit.property.type ?? "-"}</TableCell>
                  <TableCell className="text-center whitespace-normal break-words max-w-[200px]">{summarizeAddress(lease.unit.property.addresses[0])}</TableCell>
                  <TableCell className="text-center">{lease.start_date} </TableCell>
                  <TableCell className="text-center">{lease.end_date}</TableCell>
                  <TableCell>
                    <StaticBadge bgColor="bg-amber-500">
                      <Button variant={"ghost"}>Renew</Button>
                    </StaticBadge>
                  </TableCell>
                  <TableCell>
                    <StaticBadge bgColor="bg-red-600">
                      <TerminateLeaseDialog refetch={refetch} tenantName={lease.tenants[0].tenant_object.full_name} lease_id={lease.lease_id}/>
                    </StaticBadge>
                  </TableCell>
                </TableRow>
            )) :
              <TableRow>
                <TableCell colSpan={renewalHeaders.length}>
                  <EmptyResults message="No leases registered."/>
                </TableCell>
              </TableRow>
          }

        </TableBase>
      </div>
    </div>
  )
}

export default ForRenewal