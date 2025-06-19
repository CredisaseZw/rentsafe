import Layout from "../../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";
import useVatSettings from "../../../../hooks/page-hooks/useVatSettings.js";

export default function VatSettings({}) {
  const {
    loading,
    taxOptions,
    newTaxOptions,
    handleSubmit,
    changeHandler,
    removeTaxOption,
    addNewTaxOption,
    removeNewTaxOption,
  } = useVatSettings();

  return (
    <main>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col col-3 py-0">
          <div className="bg-white border custom-rounded-1 shadow-sm p-3">
            <div className="mb-3 fw-bold text-center">Registration</div>

            <div className="form-check mb-3 justify-content-center d-flex align-self-center gap-2">
              <input
                className="form-check-input "
                disabled
                // name="vat_registered"
                type="checkbox"
                value="registered"
                id="vat_registered"
              />
              <label className="form-check-label small" htmlFor="vat_registered">
                V.A.T Registered
              </label>
            </div>

            <div>
              <label
                htmlFor="vat_registration_number"
                className="form-label d-block text-center small"
              >
                VAT Registration Number
              </label>
              <input
                disabled
                type="text"
                className="form-control form-control-sm border"
                // name="vat_registration_number"
                id="vat_registration_number"
              />
            </div>
          </div>
        </div>

        <div className="col col-9">
          <div>
            <CustomTable.Table tabletitle="Tax Options">
              <CustomTable.ColGroup ratios={[null, null, 1]} />

              <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
                <tr>
                  <th>Description</th>
                  <th>Rate (%)</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {!Boolean(taxOptions?.length || newTaxOptions?.length) && (
                  <CustomTable.NothingToShow colSpan={3} />
                )}

                {taxOptions?.map((option, index) => (
                  <tr key={index}>
                    <td>{option.description}</td>
                    <td>{option.rate} %</td>

                    <td>
                      <CustomTable.RemoveRowButtonTemplate
                        onClick={() => removeTaxOption(option)}
                      />
                    </td>
                  </tr>
                ))}

                {newTaxOptions?.map((option, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="description"
                          name={"description-" + index}
                          id={"description-" + index}
                          value={option.description}
                          required
                          onChange={(e) => changeHandler("description", e.target.value, option.id)}
                        />
                      </div>
                    </td>

                    <td>
                      <div>
                        <input
                          type="number"
                          step={0.001}
                          className="form-control form-control-sm"
                          placeholder="rate in %"
                          name={"rate-" + index}
                          required
                          id={"rate-" + index}
                          value={option.rate}
                          onChange={(e) => changeHandler("rate", e.target.value, option.id)}
                        />
                      </div>
                    </td>

                    <td>
                      <CustomTable.RemoveRowButtonTemplate
                        onClick={() => removeNewTaxOption(option.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </CustomTable.Table>

            <div className="text-end mt-3">
              <CustomTable.ActionButtonTemplate
                disabled={loading}
                onClick={addNewTaxOption}
                icon="add"
              >
                Add Tax Item
              </CustomTable.ActionButtonTemplate>
            </div>

            <div className="text-end mt-3">
              <CustomTable.ActionButtonTemplate
                variant="success"
                disabled={loading || !newTaxOptions.length}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm"></span>
                    <span className="d-inline-block ms-2">Saving..</span>
                  </>
                ) : (
                  "Save"
                )}
                <i className="trailing-icon material-icons">save</i>
              </CustomTable.ActionButtonTemplate>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

VatSettings.layout = (page) => <Layout children={page} title={"Tax Options"} />;
