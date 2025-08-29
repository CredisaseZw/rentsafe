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
      <div className="flex mt-8 flex-row justify-between">
        <Searchbox
          placeholder="Search by Name"
          handleSearch={()=>{}}
        />
        <div className="flex flex-row gap-3">
          <p className="m-0 self-center text-gray-600 dark:text-gray-100 font-medium">Sort by</p>
          <Select defaultValue="default">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rent_owing_asc">Rent Owing asc</SelectItem>
              <SelectItem value="rent_owing_desc">Rent Owing desc</SelectItem>
              <SelectItem value="color_asc">Color (Rent) asc</SelectItem>
              <SelectItem value="color_asc">Color (Rent) desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3 mb-15">
        <TableBase headers={terminatedHeaders} isLoading = {isLoading} paginationData={paginationData ?? undefined} paginationName="active_page" isError = {Boolean(error)}>
          {
            leases?.length
            ? leases.map((lease:Lease)=>(
              <TableRow>      
                <TableCell className="text-center">{lease.lease_id}</TableCell>
                <TableCell className="text-center">{lease.tenants[0].tenant_object.full_name}</TableCell>
                <TableCell className="text-center">{lease.landlord.landlord_name}</TableCell>
                <TableCell className="text-center">{lease.unit.property.type}</TableCell>
                <TableCell className="text-center whitespace-normal break-words max-w-[250px]">{summarizeAddress(lease.unit.property.addresses[0])}</TableCell>
                <TableCell className="bg-yellow-400 text-center text-white font-semibold">${lease.owing}</TableCell>
                <TableCell className="text-center">{"DATE OF TERMINTATION"}</TableCell>
                <TableCell className="bg-blue-600 text-center text-white font-semibold">
                  <div className="flex items-center justify-center">
                    <Button variant={"ghost"}>Receipt</Button>
                  </div>
                </TableCell>
                <TableCell className="bg-amber-500 text-center text-white font-semibold">
                  <div className="flex items-center justify-center">
                    <Button variant={"ghost"}>Renew</Button>
                  </div>
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


