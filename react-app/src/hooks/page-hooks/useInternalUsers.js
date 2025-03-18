import { useState } from "react";

export default function useInternalUsers(users) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchValue, setSearchValue] = useState("");
  const [userModalOptions, setUserModalOptions] = useState({
    type: "",
    action: "",
    userToActOn: {},
  });

  function handleSearch(e) {
    e.preventDefault();
    setSearchValue(e.target.value);

    const filtered = users.filter((user) => {
      const q = e.target.value.toLowerCase();
      return (
        user.email.toLowerCase().includes(q) ||
        user.firstName.toLowerCase().includes(q) ||
        user.lastName.toLowerCase().includes(q)
      );
    });

    setFilteredUsers(filtered);
  }

  return {
    searchValue,
    filteredUsers,
    userModalOptions,
    setUserModalOptions,
    handleSearch,
  };
}
