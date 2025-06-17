import { MultipleUpload } from "../MultipleUpload.jsx";
import useIndividualAdd from "../../hooks/component-hooks/useIndividualAdd.js";
import ContentModal from "../ContentModal.jsx";

export default function IndividualAdd({
  show,
  handleClose,
  url,
  handleSingle,
  isSingle,
  isMultiple,
  handleMultiple,
  action,
  userDetails,
  setFetchedData,
}) {
  const { data, errors, isLoading, changeHandler, handleEdit, submitSingle } = useIndividualAdd(
    handleClose,
    url,
    action,
    userDetails,
    setFetchedData
  );

  const activeTab = isSingle ? "single" : isMultiple ? "multiple" : "";

  return (
    <ContentModal
      size="lg"
      show={!show}
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
            <fieldset className="p-4 mb-3">
              <legend>{action === "create" ? "Add Individual" : "Edit Individual"}</legend>

              <p className="text-center fw-bold">
                All fields marked with a star (<span className="text-danger">*</span>) are required.
              </p>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">
                    Surname <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.lastName}
                    onChange={changeHandler}
                    name="lastName"
                    required
                    id="lastName"
                    className="form-control form-control-sm "
                  />

                  {errors?.lastName && (
                    <div className="small px-2 text-danger mt-1">{errors.lastName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.firstName}
                    onChange={changeHandler}
                    name="firstName"
                    required
                    id="firstName"
                    className="form-control form-control-sm "
                  />

                  {errors?.firstName && (
                    <div className="small px-2 text-danger mt-1">{errors.firstName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Identification Type <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select form-select-sm "
                    name="identificationType"
                    id="identificationType"
                    required
                    onChange={changeHandler}
                    value={data.identificationType}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    <option value="nationalid">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="servicesid" disabled>
                      Service ID
                    </option>
                  </select>

                  {errors?.identificationType && (
                    <div className="small px-2 text-danger mt-1">{errors.identificationType}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">
                    Identification Number
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.identificationNumber}
                    onChange={changeHandler}
                    required
                    name="identificationNumber"
                    id="identificationNumber"
                    placeholder="eg. 12345678K29"
                    className="form-control form-control-sm "
                  />

                  {errors?.identificationNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.identificationNumber}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Gender</label>

                  <select
                    className="form-select form-select-sm "
                    onChange={changeHandler}
                    id="gender"
                    name="gender"
                    value={data.gender}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  {errors?.gender && (
                    <div className="small px-2 text-danger mt-1">{errors.gender}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Date Of birth</label>

                  <input
                    value={data.dob}
                    onChange={changeHandler}
                    type="date"
                    name="dob"
                    id="dob"
                    className="form-control form-control-sm "
                  />

                  {errors.dob && <div className="small px-2 text-danger mt-1">{errors.dob}</div>}
                </div>
              </div>

              <div className="row row-cols-3 mb-4">
                <div>
                  <label className="form-label">Marital Status</label>

                  <select
                    className="form-select form-select-sm "
                    name="maritalStatus"
                    onChange={changeHandler}
                    id="maritalStatus"
                    value={data.maritalStatus}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    <option value="single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors?.maritalStatus && (
                    <div className="small px-2 text-danger mt-1">{errors.maritalStatus}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Mobile Number <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.mobileNumber}
                    onChange={changeHandler}
                    type="tel"
                    name="mobileNumber"
                    id="mobileNumber"
                    required
                    placeholder="eg. 263777123456"
                    className="form-control form-control-sm "
                  />

                  {errors?.mobileNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.mobileNumber}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Email Address</label>

                  <input
                    value={data.emailAddress}
                    onChange={changeHandler}
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    className="form-control form-control-sm "
                  />

                  {errors?.emailAddress && (
                    <div className="small px-2 text-danger mt-1">{errors.emailAddress}</div>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="p-4 mb-3">
              <legend>Address</legend>
              {/* // Unit Number Building / Complex Name Street Number *
                  // Street Name* Suburb / Area* City / Town*
                  // Province Country* Area Code */}

              <div className="row row-cols-3">
                <div>
                  <label className="form-label">Unit Number</label>

                  <input
                    value={data.unitNumber}
                    onChange={changeHandler}
                    id="unitNumber"
                    name="unitNumber"
                    className="form-control form-control-sm "
                  />

                  {errors?.unitNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.unitNumber}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Building / Complex Name</label>

                  <input
                    value={data.buildingName}
                    onChange={changeHandler}
                    id="buildingName"
                    name="buildingName"
                    className="form-control form-control-sm "
                  />

                  {errors?.buildingName && (
                    <div className="small px-2 text-danger mt-1">{errors.buildingName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Street Number
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.streetNumber}
                    onChange={changeHandler}
                    id="streetNumber"
                    required
                    name="streetNumber"
                    className="form-control form-control-sm "
                  />

                  {errors?.streetNumber && (
                    <div className="small px-2 text-danger mt-1">{errors.streetNumber}</div>
                  )}
                </div>
              </div>

              <div className="row row-cols-3">
                <div>
                  <label className="form-label">
                    Street Name
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.streetName}
                    onChange={changeHandler}
                    id="streetName"
                    required
                    name="streetName"
                    className="form-control form-control-sm "
                  />

                  {errors?.streetName && (
                    <div className="small px-2 text-danger mt-1">{errors.streetName}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Suburb / Area
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.suburb}
                    onChange={changeHandler}
                    id="suburb"
                    required
                    name="suburb"
                    className="form-control form-control-sm "
                  />

                  {errors?.suburb && (
                    <div className="small px-2 text-danger mt-1">{errors.suburb}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    City / Town
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.city}
                    onChange={changeHandler}
                    id="city"
                    required
                    name="city"
                    className="form-control form-control-sm "
                  />

                  {errors?.city && <div className="small px-2 text-danger mt-1">{errors.city}</div>}
                </div>
              </div>

              <div className="row row-cols-3">
                <div>
                  <label className="form-label">Province</label>

                  <input
                    value={data.province}
                    onChange={changeHandler}
                    id="province"
                    name="province"
                    className="form-control form-control-sm "
                  />

                  {errors?.province && (
                    <div className="small px-2 text-danger mt-1">{errors.province}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Country
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.country}
                    onChange={changeHandler}
                    id="country"
                    required
                    name="country"
                    className="form-control form-control-sm "
                  />

                  {errors?.country && (
                    <div className="small px-2 text-danger mt-1">{errors.country}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    Area Code
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    value={data.areaCode}
                    onChange={changeHandler}
                    id="areaCode"
                    required
                    name="areaCode"
                    className="form-control form-control-sm "
                  />

                  {errors?.areaCode && (
                    <div className="small px-2 text-danger mt-1">{errors.areaCode}</div>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="p-4 mb-4">
              <legend>Employment Details</legend>

              <div className="row row-cols-3">
                <div>
                  <label className="form-label">Current Employer</label>

                  <input
                    value={data.currentEmployer}
                    onChange={changeHandler}
                    id="currentEmployer"
                    name="currentEmployer"
                    className="form-control form-control-sm "
                  />

                  {errors?.currentEmployer && (
                    <div className="small px-2 text-danger mt-1">{errors.currentEmployer}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Current Job Title</label>

                  <input
                    value={data.jobTitle}
                    onChange={changeHandler}
                    name="jobTitle"
                    id="jobTitle"
                    className="form-control form-control-sm "
                  />

                  {errors?.jobTitle && (
                    <div className="small px-2 text-danger mt-1">{errors.jobTitle}</div>
                  )}
                </div>

                <div>
                  <label className="form-label">Date of Employment</label>

                  <input
                    value={data.dateOfemployment}
                    onChange={changeHandler}
                    type="date"
                    id="dateOfemployment"
                    name="dateOfemployment"
                    className="form-control form-control-sm "
                  />

                  {errors?.dateOfemployment && (
                    <div className="small px-2 text-danger mt-1">{errors.dateOfemployment}</div>
                  )}
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
          <MultipleUpload type="individual" actionType="user" />
        )}
      </div>
    </ContentModal>
  );
}
