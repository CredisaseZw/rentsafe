import { useRef, useState } from "react";

function useWorkOrders() {
   const workOrderOptions = useRef({
      open: "Open",
      scheduled: "Scheduled",
      in_progress: "In Progress",
      completed: "Completed",
   });
   const [workOrder, setWorkOrder] = useState({
      id: "",
      selectedOption: "",
   });

   return {
      workOrder,
      workOrderOptions,
      setWorkOrder,
   };
}

export default useWorkOrders;
