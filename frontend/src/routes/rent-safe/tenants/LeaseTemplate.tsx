import Header from "@/components/general/Header";
import Searchbox from "@/components/general/Searchbox";
import SectionHeader from "@/components/general/SectionHeader";
import { TableBase } from "@/components/general/TableBase";
import { TableCell, TableRow } from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useLeases from "@/hooks/components/useLeases";
import type { PaginationData } from "@/interfaces";
import { useEffect } from "react";
import type { Lease } from "@/types";
import { getPrimaryTenantName, handleAxiosError, riskLevelColorCode, summarizeAddress } from "@/lib/utils";
import StaticBadge from "@/components/general/StaticBadge";
import { Link } from "react-router";
import { Eye } from "lucide-react";
import useGetTenantStatements from "@/hooks/apiHooks/useGetTenantStatements";
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks";
import { TENANT_STATEMENTS_HEADERS } from "@/constants";
import EmptyTableResponse from "@/components/general/EmptyTableResponse";

function LeaseTemplate() {
   const {
      page,
      search,  
      paginationData,
      leases,
      setLeases,
      setPaginationData,
   } = useLeases("ACTIVE");

   const {data, isLoading, error} = useGetTenantStatements(page, search);

   useEffect(()=>{
      if(handleAxiosError("Failed to fetch tenant statements", error)) return
      if(data){
         setLeases(search ? data.results : data ?? [])
         setPaginationData(data as PaginationData)
      }
  }, [page, search, data, error])

  
  return (
    <div className="w-full">
      <Header title="Tenant Statements"/>
      <div className="mt-6 main-sm-card">
         <SectionHeader title="Tenant statements" subTotal={leases?.length || paginationData?.count || 0} total={paginationData?.count || 0} subTitle="tenant statements "/>
         <div className="flex mt-8 flex-row justify-between">
            <Searchbox
               placeholder="Search by Name"
               
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
            <TableBase 
               headers={TENANT_STATEMENTS_HEADERS}
               isLoading = {isLoading}
               paginationData={paginationData ?? undefined}
               paginationName="active_page" 
               isError = {Boolean(error)}>
               {
                  leases?.length
                  ? leases.map((lease:Lease)=>(
                  <TableRow key={lease.id}>
                        <TableCell className="text-left">{lease.lease_id}</TableCell>
                        <TableCell className="text-left">{getPrimaryTenantName(lease.tenants)}</TableCell>
                        <TableCell className="text-left">
                           {lease.unit.property.addresses[0]
                           ? summarizeAddress(lease.unit.property.addresses[0])
                           : "-"}</TableCell>
                        <TableCell>
                           <StaticBadge bgColor={riskLevelColorCode(lease.risk_level_class)}>
                              <span className="text-white font-semibold text-sm py-2">
                                 <i>({typeof(lease.currency) === "string" && lease.currency})</i> {lease.owing}
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
                  <EmptyTableResponse colSpan={TENANT_STATEMENTS_HEADERS.length}/>
               }
            </TableBase>
         </div>
      </div>
    </div>
  )
}

export default LeaseTemplate;
