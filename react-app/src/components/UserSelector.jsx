import { useState } from "react";
import CustomAsyncSelect from "./CustomAsyncSelect.jsx";

export default function UserSelector({ onChange }) {
  const [tenantType, setTenantType] = useState("INDIVIDUAL");

  return (
    <div className="d-flex">
      <select
        className="me-1 px-1 border fw-light rounded-2"
        value={tenantType}
        name="customer_type"
        id="customer_type"
        onChange={(e) => setTenantType(e.target.value)}
      >
        <option value="INDIVIDUAL">Individual</option>
        <option value="COMPANY">Company</option>
      </select>

      <div className="custom-w-3">
        <CustomAsyncSelect
          key={tenantType}
          extraProps={{
            placeholder: "Customer Name...",
            required: true,
            id: "customer_id",
            name: "customer_id",
            className: "w-100",
          }}
          defaultValue={null}
          isDisabled={tenantType === ""}
          useAlternateFetchOptions={{ type: tenantType.toLowerCase() }}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
