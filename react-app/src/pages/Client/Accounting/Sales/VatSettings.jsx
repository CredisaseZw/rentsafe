import Layout from '../../../../components/Layouts/client/Layout.jsx';
import useVatSettings from '../../../../hooks/page-hooks/useVatSettings.js';

export default function VatSettings({}) {
  const { taxOptions, loading, addTaxOption, handleSubmit, removeTaxOption } =
    useVatSettings();

  return (
    <main>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col col-3 py-0">
          <div className="bg-white border shadow-sm p-4">
            <div className="mb-5 fw-bold">Registration</div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                // name="vat_registered"
                type="checkbox"
                value="registered"
                id="vat_registered"
              />
              <label className="form-check-label" htmlFor="vat_registered">
                V.A.T Registered
              </label>
            </div>

            <div className="mb-3">
              <label htmlFor="vat_registration_number" className="form-label">
                V.A.T Registration Number
              </label>
              <input
                type="text"
                className="form-control"
                // name="vat_registration_number"
                id="vat_registration_number"
              />
            </div>
          </div>
        </div>

        <div className="col col-9">
          <div>
            <div className="p-2 fw-bold text-center">Tax Options</div>

            <div className="custom-mn-h-2 mb-3">
              <table className="table table-sm table-respnsive border shadow-sm bg-white">
                <thead className="position-sticky c-table-top c-bg-light shadow-sm c-z-5">
                  <tr className="c-force-borders text-center">
                    <th className="ps-3" style={{ width: '60%' }}>
                      <div> Description</div>
                    </th>
                    <th>
                      <div>Rate (%) </div>
                    </th>
                    <th>
                      <div> </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!Boolean(taxOptions?.length) && (
                    <tr>
                      <td colSpan={3}>
                        <div className="p-5 bg-white d-flex justify-content-center align-items-center">
                          Nothing to show
                        </div>
                      </td>
                    </tr>
                  )}

                  {taxOptions?.map((option, index) => (
                    <tr key={index}>
                      <td
                        style={{ width: '60%' }}
                        className="custom-mn-w-2 ps-3"
                      >
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            name={'description-' + index}
                            id={'description-' + index}
                            defaultValue={option.description}
                          />
                        </div>
                      </td>

                      <td className="ps-3">
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            name={'rate-' + index}
                            id={'rate-' + index}
                            defaultValue={option.rate}
                          />
                        </div>
                      </td>

                      <td className="pe-3 custom-mx-w-05 text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeTaxOption(index)}
                        >
                          <i className="material-icons">close</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-end">
              <button
                type="button"
                disabled={loading}
                className="btn btn-outline-info "
                onClick={addTaxOption}
              >
                <i className="leading-icon material-icons">add</i>
                Add Tax Item
              </button>
            </div>

            <div className="text-center">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-info text-white"
              >
                {loading ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm"></span>
                    <span className="d-inline-block ms-2">Updating..</span>
                  </>
                ) : (
                  'Update'
                )}
                <i className="trailing-icon material-icons">save</i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

VatSettings.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
