import { Modal } from 'react-bootstrap';
import useCurrencySettings from '../../../hooks/modal-hooks/useCurrencySettings';
import { Toaster } from 'react-hot-toast';

export default function CurrencySettings({
  className,
  makeActive,
  id,
  beforeOpenningModal,
}) {
  const {
    show,
    data,
    setData,
    openModal,
    closeModal: hookCloseModal,
    handleSubmit,
    setBaseCurrency,
    setConversionCurrency,
  } = useCurrencySettings();

  function closeModal() {
    makeActive('use-last-last');
    hookCloseModal();
  }

  return (
    <>
      <a
        className={className}
        onClick={() => {
          beforeOpenningModal();
          openModal();
          makeActive(id);
        }}
      >
        Currency
      </a>

      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        contentClassName="custom-bg-whitesmoke"
        backdrop="static"
        centered
      >
        <Modal.Header className="p-0">
          <div className="w-100 px-4 pt-4 position-relative">
            <h4 className="text-center">Currency Settings</h4>

            <button
              type="button"
              onClick={closeModal}
              className="btn btn-danger btn-sm position-absolute end-0 top-0 m-2"
            >
              <i className="material-icons fs-3">close</i>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

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
                value={data.baseCurrency}
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
                    value={data.conversionCurrency}
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
                    value={data.rate}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, rate: e.target.value }))
                    }
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
        </Modal.Body>
      </Modal>
    </>
  );
}
