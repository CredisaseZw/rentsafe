import EmptyResults from "@/components/general/EmptyResults"
import Searchbox from "@/components/general/Searchbox"
import { TableBase } from "@/components/general/TableBase"
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
import { isAxiosError } from "axios"
import { useEffect } from "react"
import { toast } from "sonner"
import SectionHeader from "@/components/general/SectionHeader"
import type { Lease } from "@/types"
import LeaseRow from "@/components/general/LeaseRow"

function Active() {
  const {
    activeHeaders,
    page,
    status,
    search,
    paginationData,
    leases,
    setLeases,
    setPaginationData,
    total,
    onSuccessCallback,
    setTotal,
    onClearSearch,
    handleOnSearchValue
  } = useLeases("ACTIVE");

  const {data, isLoading, error, refetch} = useGetLeases(page, status, search);

  useEffect(()=>{
    if(isAxiosError(error)){
      console.error(error);
      const message = error.response?.data.error ?? error.response?.data.detail  ?? "Something went wrong"
      toast.error("Failed to fetch active leases", { description: message });
      return; 
    }

    if(data){
      const t = data.results.reduce((total_, lease)=> total_ + lease.owing, 0)
      setTotal(t);
      setLeases(data.results ?? [])
      setPaginationData(data as PaginationData)
    }
  }, [page, search, status, data, error])

  
  return (
    <div className="w-full">
      <div>
        <SectionHeader title="Active Leases" subTotal={leases?.length || paginationData?.count || 0} total={paginationData?.count || 0} subTitle="active leases"/>
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
          <div className="w-full">
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
        <TableBase headers={activeHeaders} isLoading = {isLoading} paginationData={paginationData ?? undefined} paginationName="active_page" isError = {Boolean(error)}>
            {
              leases?.length
              ? leases.map((lease:Lease)=>(
                <LeaseRow 
                  lease={lease}
                  key={lease.lease_id}
                  refetch={refetch}
                  onSuccessCallback = {onSuccessCallback}
                />
              )) : 
              <TableRow>
                <TableCell colSpan={activeHeaders.length}>
                  <EmptyResults message="No leases registered."/>
                </TableCell>
              </TableRow>
            }
            
            <TableRow>
              <TableCell colSpan={5}/>
              <TableCell className="text-center flex flex-col gap-1">
                USD {total}
              <i>rate : 36</i>  
              </TableCell>
            </TableRow>
          </TableBase> 
      </div>
    </div>
  )
}

export default Active