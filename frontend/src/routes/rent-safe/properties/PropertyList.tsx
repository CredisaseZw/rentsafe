import Searchbox from "@/components/general/Searchbox";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import { EllipsisVertical } from "lucide-react";
import SectionHeader from "@/components/general/SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableBase } from "@/components/general/TableBase";
import { TableCell, TableRow } from "@/components/ui/table";
import EmptyResults from "@/components/general/EmptyResults";
import type { DashboardCardProp, Option, Property } from "@/types";
import usePropertyList from "@/hooks/components/usePropertyList";
import DashboardCard from "@/components/general/DashboardCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks";
import { Link } from "react-router";
import { DELETION_LINKS, PROPERTY_HEADERS, PROPERTY_STATUS_OPTIONS } from "@/constants";
import CreatePropertyDialogue from "@/components/routes/rent-safe/properties/CreatePropertyDialogue";
import DeleteDialogue from "@/components/general/DeleteDialogue";
import { handleDeletion } from "@/lib/utils";
import { getPropertiesStore } from "@/store/propertiesStore";

function PropertyList() {
   const {
      properties,
      SummaryCards,
      status,
      propertiesLoading,
      paginationData,
   } = usePropertyList();

   return (
      <div className="">
         <div className="summary-container w-full">
            <ColumnsContainer numberOfCols={5}>
               {SummaryCards.map((card:DashboardCardProp, index:number) => (
                  <DashboardCard key={index} 
                     subTitle={card.subTitle}
                     value={String(card.value)}  
                     layoutScheme={card.layoutScheme}/>
               ))}
            </ColumnsContainer>
            <div className="main-card">
               <SectionHeader
                  title="Property Lists"
                  subTitle="property lists"
                  total={paginationData?.count ?? 0}
                  subTotal={properties.length ?? 0}
               />
               <ColumnsContainer numberOfCols={2}>
               <div>
                  <Searchbox 
                     placeholder="By address, unit number or tenant"
                   />
               </div>
               <div>
                  <div className="flex flex-row justify-end gap-3">
                     <CreatePropertyDialogue/>
                     <Select defaultValue={PROPERTY_STATUS_OPTIONS[0].value}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                              PROPERTY_STATUS_OPTIONS.map((filter:Option, index:number) => (
                                 <SelectItem key={index} value={filter.value}>{filter.label}</SelectItem>
                           ))
                           }
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               </ColumnsContainer>
               <div className="mt-6">
                  <TableBase
                     headers={PROPERTY_HEADERS}
                     paginationData={paginationData ?? undefined}
                     paginationName="page"
                     isLoading = {propertiesLoading}
                     isError = {status.isError}>
                     {  
                        properties.length
                           ? properties.map((property: Property) => (
                              <TableRow key={property.id}>
                                 <TableCell className="text-center">{property.id}</TableCell>
                                 <TableCell className="text-left">{property.name}</TableCell>
                                 <TableCell className="text-left">{property.full_address?.[0]?.city?.name || "-"}</TableCell>
                                 <TableCell className="text-left">{property.full_address?.[0]?.suburb?.name || "-"}</TableCell>
                                 <TableCell className="text-left">{property.full_address?.[0]?.street_address || "-"}</TableCell>
                                 <TableCell className="text-left">{typeof(property.property_type) === "string" ? property.property_type : ""}</TableCell>
                                 <TableCell className="flex justify-center items-center">
                                    <Popover>
                                       <PopoverTrigger>
                                          <EllipsisVertical size={18}/>
                                       </PopoverTrigger>
                                       <PopoverContent className="space-y-2">
                                          <Link to={`${RENTSAFE_PRE_SEG}/properties/property-list/${property.id}`} className="flex flex-row gap-3 justify-center items-center hover:text-green-600">
                                             <span className="text-sm dark:text-white text-gray-600">View More</span>
                                          </Link>
                                          <DeleteDialogue
                                             mutationFunc={()=>handleDeletion(DELETION_LINKS.PROPERTIES, Number(property.id))}
                                             keyStore={getPropertiesStore}
                                             value="Property"
                                             trigger={
                                                <span className="text-red-600">Delete</span>
                                             }
                                          />
                                       </PopoverContent>
                                    </Popover>
                                 </TableCell>
                              </TableRow>
                              ))
                           : (
                              <TableRow>
                                 <TableCell colSpan={PROPERTY_HEADERS.length}>
                                    <EmptyResults
                                       message="No properties enlisted yet" 
                                       option = {
                                          <CreatePropertyDialogue/>
                                       }
                                       />
                                 </TableCell>
                              </TableRow>
                           )
                     }
                  </TableBase>
               </div>
            </div>
         </div>
      </div>
   );
}
export default PropertyList;
