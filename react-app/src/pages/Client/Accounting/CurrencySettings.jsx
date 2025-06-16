import Layout from "../../../components/Layouts/client/Layout.jsx";
import NewPageHeader from "../../../components/NewPageHeader.jsx";
import useCurrencySettings from "../../../hooks/page-hooks/useCurrencySettings";

export default function CurrencySettings() {
  const { loading, currencies, currentSettings, changeHandler, handleSubmit } =
    useCurrencySettings();

  return (
    <form onSubmit={handleSubmit}>
      <NewPageHeader title="Currency Settings" />

      <div className="p-5">
        <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
          <label htmlFor="base_currency" className="form-label">
            Base Currency
          </label>

          <select
            className="form-select w-75 form-select-md"
            name="base_currency"
            id="base_currency"
            required
            onChange={changeHandler}
            value={currentSettings.base_currency}
          >
            <option disabled value="">
              Select Currency
            </option>
            {currencies?.map((currency, index) => (
              <option key={index} value={currency.id}>
                {currency.currency_code} ({currency.currency_name})
              </option>
            ))}
          </select>
        </div>

        <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
          <label className="form-label"> Currency to convert </label>

          <div className="w-75 d-flex gap-2 align-items-start">
            <div className="d-flex flex-column gap-1 align-items-start">
              <small
                id="currency_help"
                className="custom-w-10ch text-lowercase d-inline-block form-text text-nowrap text-muted"
              >
                currency
              </small>

              <select
                aria-describedby="currency_help"
                name="currency"
                id="currency"
                className="form-select "
                required
                onChange={changeHandler}
                value={currentSettings?.currency || ""}
              >
                <option disabled value="">
                  Select Currency
                </option>
                {currencies?.map((currency, index) => (
                  <option key={index} value={currency.id}>
                    {currency.currency_code} ({currency.currency_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex flex-column gap-1 align-items-start">
              <small
                id="rate_help"
                className="custom-w-10ch text-lowercase d-inline-block form-text  text-nowrap text-muted"
              >
                rate
              </small>

              <input
                className="form-control"
                aria-describedby="rate_help"
                name="current_rate"
                id="current_rate"
                type="number"
                required
                onChange={changeHandler}
                value={currentSettings?.current_rate || ""}
              />
            </div>

            <div className="d-flex flex-column gap-1 align-items-start">
              <small
                id="date_help"
                className="custom-w-10ch text-lowercase d-inline-block form-text  text-nowrap text-muted"
              >
                date
              </small>

              <input
                className="form-control c-w-fit"
                aria-describedby="date_help"
                name="date"
                id="date"
                required
                type="date"
                value={
                  new Date(currentSettings?.date_updated || new Date()).toISOString().split("T")[0]
                }
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="text-end mt-5">
          <button className="btn btn-info text-white" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-grow me-2 spinner-grow-sm" />
                <span>please wait...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

CurrencySettings.layout = (page) => <Layout children={page} title={"Currency Settings"} />;
