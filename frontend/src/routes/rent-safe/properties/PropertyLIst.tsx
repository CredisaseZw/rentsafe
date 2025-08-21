import AddPropertyForm from "@/components/forms/AddPropertyForm";
import Button from "@/components/general/Button";
import Modal from "@/components/general/Modal";
import Searchbox from "@/components/general/Searchbox";
import SummaryCard from "@/components/general/SummaryCard";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import { Eye, Plus } from "lucide-react";
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
import type { Property } from "@/types";
import type{ PaginationData } from "@/interfaces";
import usePropertyList from "@/hooks/components/usePropertyList";
import getPropertyList from "@/hooks/apiHooks/useGetPropertyList";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

function PropertyLIst() {
   const {
      headers,
      properties,
      SummaryCards,
      addPropertyModal,
      status,
      paginationData,
      onSearchValue,
      openModal,
      closeModal,
      setProperties,
      setPaginationData,
      setStatus,
   } = usePropertyList();

   const [searchParams] = useSearchParams();
   const page = parseInt(searchParams.get("page") || "1");
   const { error ,data, isLoading, refetch } = getPropertyList(page, true);
  
   useEffect(() => {
      if (error) {
         console.error(error);
         toast.error("Failed to fetch properties", { description: (error as any)?.error || "Something went wrong" });
         setStatus({ loading: false, isError: true });
         return;
      }

      if (data) {
         setProperties(data.results ?? []);
         setPaginationData(data as PaginationData);
         setStatus({ loading: false, isError: false });
      }
   }, [data, error]);

   return (
      <div className="">
         {addPropertyModal && (
            <Modal onClose={closeModal} size={"lg"} modalHeader="Add Property" allowOverflow={false}>
               <AddPropertyForm successCallback ={()=>{
                  refetch()
                  closeModal();
               }}/>
            </Modal>
         )}
         <div className="summary-container w-full">
            <ColumnsContainer numberOfCols={5}>
               {SummaryCards.map((card, index) => (
                  <SummaryCard key={index} subTitle={card.subTitle} value={card.value} />
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
                  <Searchbox placeholder="By address, unit number or tenant" handleSearch={onSearchValue} />
               </div>
               <div>
                  <div className="flex flex-row justify-end gap-3">
                     <Button onClick={openModal} className="flex flex-row gap-3">
                        <Plus size={15} className="self-center" />
                        <span className="self-center">Add Property</span>
                     </Button>
                     <Select defaultValue="defualt">
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="defualt">Default</SelectItem>
                           <SelectItem value="occupied">Occupied</SelectItem>
                           <SelectItem value="vacant">Vacant</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               </ColumnsContainer>
               <div className="mt-6">
                  <TableBase headers={headers} paginationData={paginationData ?? undefined} paginationName="page" isLoading = {isLoading} isError = {status.isError}>
                     {  
                        properties.length
                           ? properties.map((property: Property) => (
                              <TableRow key={property.id}>
                                 <TableCell className="text-center">{property.id}</TableCell>
                                 <TableCell className="text-center">{property.name}</TableCell>
                                 <TableCell className="text-center">{property.full_address?.[0]?.city?.name || "-"}</TableCell>
                                 <TableCell className="text-center">{property.full_address?.[0]?.suburb?.name || "-"}</TableCell>
                                 <TableCell className="text-center">{property.full_address?.[0]?.street_address || "-"}</TableCell>
                                 <TableCell className="text-center">{property.property_type}</TableCell>
                                 <TableCell className="flex justify-center items-center">
                                    <Button variant={"ghost"}>
                                       <Eye className="h-4 w-4"/>
                                    </Button>
                                 </TableCell>
                              </TableRow>
                              ))
                           : (
                              <TableRow>
                              <TableCell colSpan={headers.length}>
                                 <EmptyResults message="No properties enlisted yet" />
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

export default PropertyLIst;
