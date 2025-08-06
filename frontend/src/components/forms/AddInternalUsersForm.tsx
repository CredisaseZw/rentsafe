import useInternalUsers from "@/hooks/components/useInternalUsers";
import Button from "../general/Button";
import { Plus } from "lucide-react";
import AddInternalUsersApi from "@/hooks/apiHooks/useAddInternalUsersApi";
import { useEffect, useState } from "react";
import useGetUserRoles from "@/hooks/apiHooks/useGetUserRoles";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Roles } from "@/types";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import useGetUserId from "@/hooks/components/useGetUserID";
import ButtonSpinner from "../general/ButtonSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface props{
   successCallbackFN : (status:  boolean) => void;
}

function AddInternalUsersForm({successCallbackFN} : props) {
   const queryClient = useQueryClient()
   const { onChangeHandler, addInternalUsersFormData, setAddInternalUsersFormData } = useInternalUsers();
   const [userRoles, setUserRoles] = useState<Roles>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const addInternalUser = AddInternalUsersApi(useGetUserId());
   const { data, isLoading, isError } = useGetUserRoles();

   // Function to handle form submission
   const submitAddInternalUsersForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      addInternalUser.mutate(addInternalUsersFormData, {
         onSuccess: () => {
            toast.success("User added successfully")
            queryClient.invalidateQueries({queryKey : ["clients_for", useGetUserId()]})
            successCallbackFN(true)
         },
         onError: (error) => {
            console.error("Error adding user:", error);
            toast.error("Error occured adding user")
         },
         onSettled: ()=> setLoading(false)
         
      });
   };

   useEffect(() => {
      if (data && Array.isArray(data)) {
         setUserRoles(data);
      }
   }, [data]);
   return (
      <form onSubmit={submitAddInternalUsersForm} method="post">
         <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="form-group">
               <label htmlFor="" className="required">
                  First name
               </label>
               <Input
                  type="text"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.firstName}
                  name="firstName"
                  placeholder="First name.."
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Last name
               </label>
               <Input
                  type="text"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.lastName}
                  name="lastName"
                  placeholder="Last Name ..."
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Email
               </label>
               <Input
                  type="email"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.email}
                  name="email"
                  placeholder="Email"
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Access Level
               </label>
               <div className="w-full self-center">
                  <Select
                     disabled={isError}
                     onValueChange={(value) => setAddInternalUsersFormData((prev) => ({ ...prev, accessLevel: value }))}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                     </SelectTrigger>
                     <SelectContent>
                        {isLoading ? (
                           <SelectItem value="loading" disabled>
                              Loading...
                           </SelectItem>
                        ) : (
                           userRoles.map((role) => (
                              <Tooltip key={role.id}>
                                 <TooltipTrigger asChild>
                                    <SelectItem value={String(role.id)}>{role.name}</SelectItem>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    <p>{role.description}</p>
                                 </TooltipContent>
                              </Tooltip>
                           ))
                        )}
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </div>
         <div className="mt-6 flex w-full justify-end">
            <Button type="submit" asChild disabled = {loading}>
               {
                  loading ? <ButtonSpinner/> :
                  <Plus size={18}/>
               }
               Register User
            </Button>
         </div>
      </form>
   );
}

export default AddInternalUsersForm;
