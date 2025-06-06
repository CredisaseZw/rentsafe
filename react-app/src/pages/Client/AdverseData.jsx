import useAdverseDataVersion2 from "../../hooks/modal-hooks/useAdverseDataVersion2.js";
import CustomAsyncSelect from "../../components/CustomAsyncSelect.jsx";
import Layout from "../../components/Layouts/client/Layout.jsx";
import NewPageHeader from "../../components/NewPageHeader.jsx";

export default function AdverseData({ Auth }) {
  const { processing, creditor, tenantType, setTenantType, handleSingleSubmit } =
    useAdverseDataVersion2(Auth);

  return (
    <div>
      <NewPageHeader title="Adverse Data" />

      <form onSubmit={handleSingleSubmit}>
        <div className="p-2 mb-3">
          <label htmlFor="data_type" className="form-label">
            Data Type
          </label>

          <select
            className="form-select custom-mx-w-3 form-select-md"
            name="data_type"
            id="data_type"
            required
            defaultValue={"claim"}
          >
            <option value="claim">Claim</option>
            <option value="absconder">Absconder</option>
            <option value="court">Court</option>
            <option value="public-records">Public Records</option>
          </select>
        </div>

        <div className="p-2 mb-3">
          <div className="px-3 fw-bold mb-3">Creditor</div>

          <div className="d-flex align-items-center justify-content-start gap-4">
            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="creditor_id" className="form-label">
                Creditor ID/Reg #/Name
              </label>

              <input
                className="w-100 custom-form-control-disabled p-2 rounded-2"
                name="creditor_id"
                id="creditor_id"
                required
                value={creditor}
                readOnly
              />
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="date" className="form-label">
                Data Date
              </label>

              <input
                type="date"
                className="form-control"
                name="date"
                id="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="px-3 fw-bold mb-3">Debtor</div>

          <div className="d-flex align-items-center justify-content-start gap-4">
            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="debtor_type" className="form-label">
                Debtor Type
              </label>

              <select
                className="form-select form-select-md"
                name="debtor_type"
                id="debtor_type"
                required
                value={tenantType}
                onChange={(e) => setTenantType(e.target.value)}
              >
                <option value="" disabled>
                  select debtor type...
                </option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03 flex-grow-1">
              <label htmlFor="debtor_id" className="form-label">
                Debtor ID/Reg #/Name
              </label>

              <CustomAsyncSelect
                key={tenantType}
                extraProps={{
                  required: true,
                  id: "debtor_id",
                  className: "w-100",
                  name: "debtor_id",
                }}
                defaultValue={null}
                isDisabled={tenantType === ""}
                useAlternateFetchOptions={{ type: tenantType.toLowerCase() }}
              />
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="account_number" className="form-label">
                Account Number
              </label>

              <input className="form-control" name="account_number" id="account_number" />
            </div>
          </div>

          <div className="mt-2 d-flex align-items-center justify-content-start gap-4">
            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>

              <select
                className="form-select custom-mx-w-3 form-select-md"
                name="currency"
                id="currency"
                required
                defaultValue={"usd"}
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
                <option value="ZAR">Rand</option>
              </select>
            </div>

            <div className="d-flex flex-column align-items-start gap-2 custom-w-03">
              <label htmlFor="amount" className="form-label">
                Claim Amount
              </label>

              <input type="number" className="form-control" name="amount" id="amount" required />
            </div>
          </div>
        </div>

        <div className="text-end px-5">
          <button disabled={processing} className="btn btn-info text-white" type="submit">
            {processing ? (
              <span>
                <span
                  className="me-2 spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

AdverseData.layout = (page) => <Layout children={page} title="Todo List" />;
