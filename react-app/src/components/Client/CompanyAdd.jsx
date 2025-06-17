import { MultipleUpload } from "../MultipleUpload.jsx";
import { industries } from "../../constants/index.js";
import useCompanyAdd from "../../hooks/modal-hooks/useCompanyAdd.js";
import ContentModal from "../ContentModal.jsx";

export const CompanyAdd = ({
  show,
  handleClose,
  isSingle,
  handleSingle,
  isMultiple,
  handleMultiple,
  url,
  action,
  companyData,
  setFetchedData,
}) => {
  const { data, errors, isLoading, handleEdit, changeHandler, submitSingle } = useCompanyAdd(
    url,
    companyData,
    handleClose,
    setFetchedData
  );

  const activeTab = isSingle ? "single" : isMultiple ? "multiple" : "";

  return (
    <ContentModal
      size="lg"
      show={show}
      handleClose={handleClose}
      titleOverideContent={
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${activeTab === "single" ? "btn-info text-white" : "btn-light border border-2"}`}
            onClick={handleSingle}
          >
            Single
          </button>
          <button
            className={`btn btn-sm ${activeTab === "multiple" ? "btn-info text-white" : "btn-light border border-2"}`}
            onClick={handleMultiple}
          >
            Multiple
          </button>
        </div>
      }
    >
      <div style={{ minHeight: "600px" }} className="p-3">
        {activeTab === "single" ? (
          <form onSubmit={action === "create" ? submitSingle : handleEdit}>
            <fieldset className="p-4 mb-4">
              <legend>{action === "create" ? "Add Company" : "Edit Company"}</legend>

              <p className="text-center fw-bold">
                All fields marked with a star (<span className="text-danger">*</span>) are required.
              </p>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">
                    Registered Name
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    required
                    value={data.registeredName}
                    onChange={changeHandler}
                    name="registeredName"
                    id="registeredName"
                    className="form-control"
                  />

                  {errors?.registeredName && (
                    <div className="small px-2 text-danger mt-1">{errors.registeredName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Trading Name
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    required
                    value={data.tradingName}
                    onChange={changeHandler}
                    name="tradingName"
                    id="tradingName"
                    className="form-control"
                  />
                  {errors?.tradingName && (
                    <div className="small px-2 text-danger mt-1">{errors.tradingName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Branch</label>

                  <input
                    value={data.branch}
                    onChange={changeHandler}
                    id="branch"
                    name="branch"
                    className="form-control"
                  />

                  {errors?.branch && (
                    <div className="px-2 small text-danger mt-1">{errors.branch}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">Registration Number</label>

                  <input
                    value={data.companyRegistrationNumber}
                    onChange={changeHandler}
                    name="companyRegistrationNumber"
                    id="companyRegistrationNumber"
                    placeholder="eg. 000/984/2020"
                    className="form-control"
                  />

                  {errors?.companyRegistrationNumber && (
                    <div className="small px-2 text-danger mt-1">
                      {errors.companyRegistrationNumber}
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Registration Date</label>

                  <input
                    value={data.registrationDate}
                    onChange={changeHandler}
                    type="date"
                    name="registrationDate"
                    id="registrationDate"
                    className="form-control"
                  />

                  {errors.registrationDate && (
                    <div className="small px-2 text-danger mt-1">{errors.registrationDate}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">VAT Number</label>

                  <input
                    value={data.vatNumber}
                    onChange={changeHandler}
                    name="vatNumber"
                    id="vatNumber"
                    placeholder="eg. 1123456789"
                    className="form-control"
                  />

                  {errors?.vatNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.vatNumber}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">TIN Number</label>

                  <input
                    value={data.tinNumber}
                    onChange={changeHandler}
                    type="text"
                    name="tinNumber"
                    id="tinNumber"
                    className="form-control"
                  />

                  {errors?.tinNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.tinNumber}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Current Address
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    required
                    value={data.currentAddress}
                    onChange={changeHandler}
                    name="currentAddress"
                    placeholder="eg. 1234 Main St"
                    id="currentAddress"
                    className="form-control"
                  />

                  {errors?.currentAddress && (
                    <div className="small px-2 text-danger mt-1">{errors.currentAddress}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Telephone Number</label>

                  <input
                    type="tel"
                    value={data.landLine}
                    onChange={changeHandler}
                    placeholder="123-456-7890"
                    name="landLine"
                    id="landLine"
                    className="form-control"
                  />

                  {errors?.landLine && (
                    <div className="small px-2 text-danger mt-1">{errors.landLine}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">Mobile Number</label>

                  <input
                    type="tel"
                    value={data.mobileNumber}
                    onChange={changeHandler}
                    placeholder='eg. "263712345612"'
                    id="mobileNumber"
                    name="mobileNumber"
                    className="form-control"
                  />

                  {errors?.mobileNumber && (
                    <div className="px-2 small text-danger mt-1">{errors.mobileNumber}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Email Address
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    required
                    type="email"
                    value={data.emailAddress}
                    onChange={changeHandler}
                    name="emailAddress"
                    id="emailAddress"
                    placeholder="example@company.com"
                    className="form-control"
                  />

                  {errors?.emailAddress && (
                    <div className="small px-2 text-danger mt-1">{errors.emailAddress}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Website</label>

                  <input
                    type="url"
                    value={data.website}
                    onChange={changeHandler}
                    id="website"
                    name="website"
                    placeholder="https://your-website.com"
                    className="form-control"
                  />

                  {errors?.website && (
                    <div className="small px-2 text-danger mt-1">{errors.website}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3">
                <div>
                  <label className="form-label">Industry</label>

                  <select
                    className="form-select"
                    name="industry"
                    id="industry"
                    value={data.industry}
                    onChange={changeHandler}
                  >
                    <option>Select...</option>

                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>

                  {errors?.industry && (
                    <div className="small px-2 text-danger mt-1">{errors.industry}</div>
                  )}
                </div>

                <div>
                  <label className="form-label"></label>

                  <div className="form-check d-flex justify-content-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_gvt"
                      id="is_gvt"
                      checked={data.is_gvt}
                      onChange={changeHandler}
                    />
                    <label className="form-check-label">Government Org </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">Note</label>

                  <input
                    value={data.note}
                    onChange={changeHandler}
                    id="note"
                    name="note"
                    placeholder="additional notes..."
                    className="form-control"
                  />

                  {errors?.note && <div className="px-2 small text-danger mt-1">{errors.note}</div>}
                </div>
              </div>
            </fieldset>

            <div className="text-end">
              <button type="submit" disabled={isLoading} className="btn btn-info text-white">
                {isLoading ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm"></span>
                    <span className="ms-2">processing..</span>
                  </>
                ) : (
                  "Save and Proceed"
                )}
              </button>
            </div>
          </form>
        ) : (
          <MultipleUpload type={"company"} actionType={"user"} />
        )}
      </div>
    </ContentModal>
  );
};
