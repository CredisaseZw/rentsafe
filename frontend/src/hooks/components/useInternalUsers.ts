import type { Header } from "@/types";
import React, { useState } from "react";

function useInternalUsers() {
   const headers:Header[] = [
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
   const closeModal = () => setModalVisible(false);

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
      closeModal,
      onChangeHandler,
      setAddInternalUsersFormData,
   };
}

export default useInternalUsers;
