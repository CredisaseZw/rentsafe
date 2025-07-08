import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { userFriendlyErrorOrResponse } from "../../../../utils";

export default function SearchCreditor({
  delay = 500,
  url,
  value,
  setValue,
  placeholder,
  setLeaseId,
  setCreditorName,
  setOpeningBalance,
  setEndDate,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    if (!value) {
      setClients([]);
      return;
    }

    const handler = _.debounce((newValue) => {
      if (newValue.length < 3 || selected) {
        return;
      }
      setIsLoading(true);
      axios
        .post(url, {
          searchParam: "guess",
          searchValue: newValue,
        })
        .then((response) => {
          if (response.data?.status !== "failed") {
            setRawData([...response.data]);
            setClients(
              response.data.map((client) => ({
                label: client.company_name || client.full_name,
                value: client.lease_id,
              }))
            );
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

  const handleSelect = (client) => {
    setSelected(true);
    const selectedCreditor = rawData.find((c) => c.lease_id === client.value);
    setLeaseId(client.value);
    setValue(client.label);
    setCreditorName && setCreditorName(client.label);
    setOpeningBalance &&
      setOpeningBalance(
        selectedCreditor.company_opening_balance || selectedCreditor.opening_balance
      );
    setEndDate &&
      setEndDate(
        selectedCreditor.company_opening_balance_date || selectedCreditor.opening_balance_date
      );

    setShowDropdown(false);
    setSelected(false);
  };

  return (
    <div className="position-relative">
      <input
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
        }}
        className="form-control form-control-sm bg-light"
      />

      {showDropdown && value && (
        <div
          style={{ overflowY: "auto" }}
          className="border border-dark rounded-1 bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1 small"
        >
          {!isLoading && error ? (
            <div className="text-danger p-2">{error}</div>
          ) : isLoading && clients.length === 0 ? (
            <small className="d-block p-2">Loading...</small>
          ) : (
            clients.map((client, index) => (
              <div
                key={index}
                onClick={() => handleSelect(client)}
                className="c-pointer p-1 small border-bottom border-dark"
              >
                <small>{client.label}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
