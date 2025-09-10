import Header from "@/components/general/Header";
import Searchbox from "@/components/general/Searchbox";
import SectionHeader from "@/components/general/SectionHeader";
import { TableBase } from "@/components/general/TableBase";
import { TableCell, TableRow } from "@/components/ui/table"
import EmptyResults from "@/components/general/EmptyResults"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useLeases from "@/hooks/components/useLeases";
import type { PaginationData } from "@/interfaces";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Lease } from "@/types";
import { getPrimaryTenantName, riskLevelColorCode, summarizeAddress } from "@/lib/utils";
import StaticBadge from "@/components/general/StaticBadge";
import { Link } from "react-router";
import { Eye } from "lucide-react";
import useGetTenantStatements from "@/hooks/apiHooks/useGetTenantStatements";
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks";
import { TENANT_STATEMENTS_HEADERS } from "@/constants";

function LeaseTemplate() {
   const {
      page,
      status,
      search,  
      paginationData,
      leases,
      setLeases,
      setPaginationData,
      onClearSearch,
      handleOnSearchValue
   } = useLeases("ACTIVE");

   const {data, isLoading, error} = useGetTenantStatements(page, search);

   useEffect(()=>{
      if(isAxiosError(error)){
         console.error(error);
         const message = error.response?.data.error ?? error.response?.data.detail  ?? "Something went wrong"
         toast.error("Failed to fetch tenant statements", { description: message });
         return; 
      }

      if(data){

         setLeases(data ?? [])
         setPaginationData(data as PaginationData)
      }
  }, [page, search, status, data, error])

  
  return (
    <div className="w-full">
      <Header title="Tenant Statements"/>
      <div className="mt-6 main-sm-card">
         <SectionHeader title="Tenant statements" subTotal={leases?.length || paginationData?.count || 0} total={paginationData?.count || 0} subTitle="tenant statements "/>
         <div className="flex mt-8 flex-row justify-between">
            <Searchbox
               placeholder="Search by Name"
               handleSearch={handleOnSearchValue}
               clearSearch = {onClearSearch}
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
         <div className="mt-3 ">
            <TableBase headers={TENANT_STATEMENTS_HEADERS} isLoading = {isLoading} paginationData={paginationData ?? undefined} paginationName="active_page" isError = {Boolean(error)}>
               {
                  leases?.length
                  ? leases.map((lease:Lease)=>(
                  <TableRow>
                        <TableCell className="text-center">{lease.lease_id}</TableCell>
                        <TableCell className="text-center">{getPrimaryTenantName(lease.tenants)}</TableCell>
                        <TableCell className="text-center">
                           {lease.unit.property.addresses[0]
                           ? summarizeAddress(lease.unit.property.addresses[0])
                           : "-"}</TableCell>
                        <TableCell>
                           <StaticBadge bgColor={riskLevelColorCode(lease.risk_level_class)}>
                              <span className="text-white font-semibold text-sm py-2">
                                 <i>({lease.currency as unknown as string})</i> {lease.owing}
                              </span>
                           </StaticBadge>
                        </TableCell>
                        <TableCell>
                           <Link to={`${RENTSAFE_PRE_SEG}/tenants/tenant-statement/${lease.lease_id}`} className="flex flex-row gap-3 justify-center items-center hover:text-green-600">
                              <Eye size={15} className="self-center"></Eye>
                              <span className="text-sm">View</span>
                           </Link>
                        </TableCell>
                  </TableRow>
                  )) : 
                  <TableRow>
                  <TableCell colSpan={TENANT_STATEMENTS_HEADERS.length}>
                     <EmptyResults message="No statements created yet."/>
                  </TableCell>
                  </TableRow>
               }
            </TableBase>
         </div>
      </div>
    </div>
  )
}

export default LeaseTemplate;
