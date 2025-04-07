import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { usePage } from "@inertiajs/inertia-react";
import toast from "react-hot-toast";
import { userFriendlyErrorOrResponse } from "../utils";

// eslint-disable-next-line react/prop-types
export default function SearchComponent({
  delay = 500,
  url,
  value,
  setValue,
  placeholder,
  type,
  setAddress,
  setClientId,
  setRegNumber,
  setClientName,
  setMobileNo,
  from = "subs",
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    if (!value) {
      setClients([]);
      return;
    }

    const handler = _.debounce((newValue) => {
      setIsLoading(true);
      axios
        .post(url, {
          searchParam: "guess",
          searchValue: newValue,
        })
        .then((response) => {
          if (response.data?.status !== "failed") {
            if (type === "company") {
              setRawData([...response.data]);
              setClients(
                response.data.map((client) => ({
                  label: client.registration_name + "(" + client.registration_number + ")",
                  value: client.id,
                }))
              );
            } else {
              setClients(
                response.data.map((client) => ({
                  label: client.firstname + " " + client.surname + "(" + client.national_id + ")",
                  value: client.id,
                }))
              );
            }
            setError("");
            setIsLoading(false);
          } else {
            setClients([]);
            setIsLoading(false);
            setError(userFriendlyErrorOrResponse(response));
          }
        });
    }, delay);

    handler(value);
    setIsLoading(false);
    return () => {
      handler.cancel();
    };
  }, [delay, url, value]);

  const company_id = usePage().props?.Auth?.company?.company_id;

  const handleSelect = (client) => {
    const isSelfCompany = Number(client.value) === Number(company_id);

    console.log({
      selected_company_id: client.value,
      company_id,
      isSelfCompany,
    });

    if (isSelfCompany) {
      toast.error("Blocked, a company cannot create a lease on itself");
      return;
    }

    setClientId(client.value);
    setValue(client.label);
    setClientName && setClientName(client.label.split("(")[0]);
    setRegNumber && from === "subs" && setRegNumber(client.label.split("(").at(-1).split(")")[0]);
    setRegNumber &&
      from === "leases" &&
      setRegNumber(rawData.find((c) => c.id === client.value).email);
    setMobileNo &&
      from === "leases" &&
      setMobileNo(rawData.find((c) => c.id === client.value).mobile);
    setAddress && setAddress(rawData.find((c) => c.id === client.value).address);
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid gray",
        borderRadius: "0.5rem",
        position: "relative",
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
        }}
        style={{
          width: "100%",
          padding: "0.2rem",
          fontSize: "1rem",
          border: "none",
          borderRadius: "0.5rem",
          backgroundColor: "#eee",
          color: "black",
          opacity: "0.8",
        }}
        className="form-control"
      />
      {showDropdown && (
        <div
          style={{
            border: "2px #ccc solid",
            borderRadius: "0.5rem",
            backgroundColor: "#d9d9d9",
            padding: "1rem 0.2rem",
            height: "250px",
            overflowY: "scroll",
            width: "100%",
            marginTop: "0.1rem",
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: "100",
          }}
        >
          {!isLoading && error ? (
            <div style={{ color: "red", margin: "auto" }}>{error}</div>
          ) : isLoading && clients.length === 0 ? (
            <div style={{ color: "black", margin: "auto" }}>Loading...</div>
          ) : (
            clients.map((client, index) => (
              <div
                key={index}
                onClick={() => handleSelect(client)}
                style={{
                  cursor: "pointer",
                  padding: "0.2rem 0.5rem",
                  color: "black",
                  opacity: "0.8",
                  backgroundColor: "#d3d3d3",
                  borderRadius: "0.5rem",
                  margin: "0.5rem 0",
                }}
              >
                {client.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
