import { useState, useEffect } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { userFriendlyErrorOrResponse } from '../../../../utils';

// eslint-disable-next-line react/prop-types
export default function SearchCustomerComponent({
  delay = 500,
  url,
  value,
  setValue,
  placeholder,
  type,
  setLeaseId,
  setCustomerName,
  setOpeningBalance,
  setEndDate,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [error, setError] = useState('');
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
          searchParam: 'guess',
          searchValue: newValue,
        })
        .then((response) => {
          if (response.data?.status !== 'failed') {
            setRawData([...response.data]);
            if (type === 'company') {
              setClients(
                response.data.map((client) => ({
                  label: client.company_name,
                  value: client.lease_id,
                }))
              );
            } else {
              setClients(
                response.data.map((client) => ({
                  label: client.full_name,
                  value: client.lease_id,
                }))
              );
            }
            setError('');
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
    const selectedCustomer = rawData.find((c) => c.lease_id === client.value);
    setLeaseId(client.value);
    setValue(client.label);
    setCustomerName && setCustomerName(client.label);
    setOpeningBalance &&
      setOpeningBalance(
        type === 'company'
          ? selectedCustomer.company_opening_balance
          : selectedCustomer.opening_balance
      );
    setEndDate &&
      setEndDate(
        type === 'company'
          ? selectedCustomer.company_opening_balance_date
          : selectedCustomer.opening_balance_date
      );

    setShowDropdown(false);
    setSelected(false);
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
        }}
        className="form-control c-bg-light"
      />
      {showDropdown && value && (
        <div
          style={{ overflowY: 'auto' }}
          className="border border-dark rounded-1 c-bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1"
        >
          {!isLoading && error ? (
            <div className="text-danger p-2">{error}</div>
          ) : isLoading && clients.length === 0 ? (
            <div className="p-2">Loading...</div>
          ) : (
            clients.map((client, index) => (
              <div
                key={index}
                onClick={() => handleSelect(client)}
                className="c-pointer p-1 small border-bottom border-dark"
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
