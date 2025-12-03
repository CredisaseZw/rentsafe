import AddPropertyForm from "@/components/forms/AddPropertyForm";
import Button from "@/components/general/Button";
import Modal from "@/components/general/Modal";
import Searchbox from "@/components/general/Searchbox";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import { EllipsisVertical, Plus } from "lucide-react";
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
import { PROPERTY_STATUS_OPTIONS } from "@/constants";

function PropertyList() {
   const {
      headers,
      properties,
      SummaryCards,
      addPropertyModal,
      status,
      propertiesLoading,
      paginationData,
      openModal,
      closeModal,
      onPropertiesRetch
   } = usePropertyList();

   return (
      <div className="">
         {addPropertyModal && (
            <Modal onClose={closeModal} size={"lg"} modalHeader="Add Property" allowOverflow={false}>
               <AddPropertyForm successCallback ={()=>{
                  onPropertiesRetch()
                  closeModal();
               }}/>
            </Modal>
         )}
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
                     <Button onClick={openModal} className="flex flex-row gap-3">
                        <Plus size={15} className="self-center" />
                     <span className="self-center">Add Property</span>
                     </Button>
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
                  <TableBase headers={headers} paginationData={paginationData ?? undefined} paginationName="page" isLoading = {propertiesLoading} isError = {status.isError}>
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
                                       <PopoverContent>
                                          <Link to={`${RENTSAFE_PRE_SEG}/properties/property-list/${property.id}`} className="flex flex-row gap-3 justify-center items-center hover:text-green-600">
                                             <span className="text-sm dark:text-white text-gray-600">View More</span>
                                          </Link>
                                       </PopoverContent>
                                    </Popover>
                                 </TableCell>
                              </TableRow>
                              ))
                           : (
                              <TableRow>
                                 <TableCell colSpan={headers.length}>
                                    <EmptyResults
                                       message="No properties enlisted yet" 
                                       option = { 
                                       <Button onClick={openModal} className="flex flex-row gap-3">
                                          <Plus size={15} className="self-center" />
                                          <span className="self-center">Add Property</span>
                                       </Button>}
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
