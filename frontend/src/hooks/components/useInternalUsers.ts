import React, { useState } from "react";

function useInternalUsers() {
   const headers = [
      {
         name: "First Name",
         textAlign: "left",
      },
      {
         name: "Last Name",
         textAlign: "left",
      },
      {
         name: "Access Level",
         textAlign: "left",
      },
      {
         name: "Email",
         textAlign: "left",
      },
      {
         name: "Actions",
         textAlign: "center",
      },
   ];
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [addInternalUsersFormData, setAddInternalUsersFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      accessLevel: "",
   });
   const openModal = () => setModalVisible(true);
   const closeodal = () => setModalVisible(false);

   const handleUserSearch = (searchValue: string) => {
      console.log(searchValue);
   };

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAddInternalUsersFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   return {
      addInternalUsersFormData,
      modalVisible,
      headers,
      handleUserSearch,
      openModal,
      closeodal,
      onChangeHandler,
      setAddInternalUsersFormData,
   };
}

export default useInternalUsers;
