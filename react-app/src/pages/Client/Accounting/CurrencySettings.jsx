import Layout from "../../../components/Layouts/client/Layout.jsx";
import useCurrencySettings from "../../../hooks/page-hooks/useCurrencySettings";

export default function CurrencySettings({ currency_settings, errors, success }) {
  const { data, setData, handleSubmit, setBaseCurrency, setConversionCurrency } =
    useCurrencySettings(currency_settings, errors, success);

  return (
    <div>
      <h6 className="text-center bg-info text-white p-2 rounded-3">Currency Settings</h6>

      <form
        className="custom-mn-h-5 justify-content-center w-75  mx-auto d-flex flex-column"
        onSubmit={handleSubmit}
      >
        <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
          <label htmlFor="base_currency" className="form-label">
            1. Base Currency
          </label>

          <select
            className="form-select w-75 form-select-md"
            name="base_currency"
            id="base_currency"
            required
            value={data.base_currency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            <option value="" disabled>
              select currency
            </option>
            <option value="usd">USD</option>
            <option value="zwg">ZWG</option>
            {/* <option value="zar">ZAR</option> */}
          </select>
        </div>

        <div className="w-100 my-2 d-flex align-items-center justify-content-between gap-4">
          <label className="form-label">2. Currency Coversion </label>

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
                value={data.currency}
                onChange={(e) => setConversionCurrency(e.target.value)}
              >
                <option value="" disabled>
                  select currency
                </option>
                <option value="usd">USD</option>
                <option value="zwg">ZWG</option>
                {/* <option value="zar">ZAR</option> */}
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
                name="rate"
                id="rate"
                type="number"
                value={data.current_rate}
                onChange={(e) => setData((prev) => ({ ...prev, current_rate: e.target.value }))}
                required
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
                value={data.date}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-info text-white" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

CurrencySettings.layout = (page) => <Layout children={page} title={"Currency Settings"} />;
