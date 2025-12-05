import { useState, useEffect } from "react";
import type { DashboardCardProp, Property } from "@/types";
import type { PaginationData } from "@/interfaces";
import { BadgeCent, DoorOpen, HouseIcon, Users, Wrench } from "lucide-react";
import { useSearchParams } from "react-router";
import { handleAxiosError,  } from "@/lib/utils";
import getPropertyList from "../apiHooks/useGetPropertyList";

function usePropertyList() {
   const [searchParams] = useSearchParams();
   const page = parseInt(searchParams.get("page") || "1");
   const search = searchParams.get("search") || "";
   const { propertiesError, propertiesLoading, propertyRows } = getPropertyList(page, search ,true);
   const [SummaryCards] = useState<DashboardCardProp[]>(
      [
         {  subTitle: "Total Properties", 
            value: 35,
            layoutScheme : {
               icon: HouseIcon,
               color: "blue",
            }
         },
         {  subTitle: "Occupied",
            value: 28,
            layoutScheme : {
               icon: Users,
               color: "red",
            }

          },
         {  subTitle: "Vacant",
            value: 5,
            layoutScheme :{
               icon: DoorOpen,
               color : "purple"
            }
          },
         { subTitle: "Maintenance",
            value: 2,
            layoutScheme : {
               icon : Wrench,
               color : "amber"
            }
          },
         {  subTitle: "Monthly Revenue",
            value: "$8,500",
            layoutScheme : {
               icon : BadgeCent,
               color : "green"
            }
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
