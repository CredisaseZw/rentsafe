import { useState, useEffect } from "react";
import type { Property } from "@/types";
import type { PaginationData } from "@/interfaces";
import { BadgeCent, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";
import { useSearchParams } from "react-router";
import { handleAxiosError,  } from "@/lib/utils";
import getPropertyList from "../apiHooks/useGetPropertyList";
import type { DashboardCardProps } from "@/components/general/DashboardCard";

function usePropertyList() {
   const [searchParams] = useSearchParams();
   const page = parseInt(searchParams.get("page") || "1");
   const search = searchParams.get("search") || "";
   const { propertiesError, propertiesLoading, propertyRows } = getPropertyList(page, search ,true);
   const [SummaryCards] = useState<DashboardCardProps[]>(
      [
         {  title: "Total Properties", 
            value: 35,
            icon: HouseIcon,
            variant: "blue",
            
         },
         {  title: "Occupied",
            value: 28,
            icon: Users,
            variant: "warning",
          },
         {  title: "Vacant",
            value: 5,
            icon: DoorOpen,
            variant : "success"
            
          },
         { title: "Maintenance",
            value: 2,
            icon : Wrench,
            variant : "danger"
            
          },
         {  title: "Monthly Revenue",
            value: "$8,500",
            icon : BadgeCent,
            variant : "pink"
         },
      ]
   );

   const [selectedFilter, setSelectFilter] = useState("all_properties");
   const [status, setStatus] = useState({ loading: true, isError: false });
   const [properties, setProperties] = useState<Property[]>([]);
   const [paginationData, setPaginationData] = useState<PaginationData | undefined>(undefined);

   useEffect(() => {
      if(handleAxiosError("Failed to fetch properties", propertiesError)) return;
      if (propertyRows) {
         setProperties(propertyRows.results ?? []);
         setPaginationData(propertyRows as PaginationData);
         setStatus({ loading: false, isError: false });
      }
   }, [propertyRows, propertiesError]);


   return {
      selectedFilter,
      properties,
      SummaryCards,
      status,
      propertiesLoading,
      paginationData,
      setSelectFilter
   };
}

export default usePropertyList;
