import React, { useState } from "react";

function useInternalUsers() {
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
      handleUserSearch,
      openModal,
      closeodal,
      onChangeHandler,
   };
}

export default useInternalUsers;
