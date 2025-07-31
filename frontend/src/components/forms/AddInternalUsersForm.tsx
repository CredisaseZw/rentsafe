import useInternalUsers from "@/hooks/components/useInternalUsers";
import Button from "../general/Button";
import { Plus } from "lucide-react";
import AddInternalUsersApi from "@/hooks/apiHooks/useInternalUsersApi";

function AddInternalUsersForm() {
   const { onChangeHandler, addInternalUsersFormData } = useInternalUsers();
   const addInternalUser = AddInternalUsersApi();

   // Function to handle form submission
   const submitAddInternalUsersForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addInternalUser.mutate(addInternalUsersFormData, {
         onSuccess: (data) => {
            console.log("User added successfully:", data);
         },
         onError: (error) => {
            console.error("Error adding user:", error);
         },
      });
   };

   return (
      <form onSubmit={submitAddInternalUsersForm} method="post">
         <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="form-group">
               <label htmlFor="" className="required">
                  First name
               </label>
               <input
                  type="text"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.firstName}
                  className="input-default"
                  name="firstName"
                  placeholder="First name.."
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Last name
               </label>
               <input
                  type="text"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.lastName}
                  className="input-default"
                  name="lastName"
                  placeholder="Last Name ..."
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Email
               </label>
               <input
                  type="text"
                  required
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.email}
                  className="input-default"
                  name="email"
                  placeholder="Email"
               />
            </div>
            <div className="form-group">
               <label htmlFor="" className="required">
                  Access Level
               </label>
               <select
                  name="accessLevel"
                  className="input-default"
                  onChange={onChangeHandler}
                  value={addInternalUsersFormData.accessLevel}
                  id=""
               >
                  <option value="1">Admin</option>
                  <option value="2">User</option>
               </select>
            </div>
         </div>
         <div className="mt-6 flex w-full justify-end">
            <Button type="submit" asChild>
               <Plus size={15} />
               Register User
            </Button>
         </div>
      </form>
   );
}

export default AddInternalUsersForm;
