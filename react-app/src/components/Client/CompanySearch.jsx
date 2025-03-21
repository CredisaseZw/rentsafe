import BulkIconButton from "../BulkIconButton.jsx";
import CompanyReport from "./Report/CompanyReport.jsx";
import BulkUploadModal from "../BulkUploadModal.jsx";
import useCompanySearch from "../../hooks/component-hooks/useCompanySearch.js";
import { CompanyVerify } from "./OTP/CompanyVerify.jsx";
import { CompanyAdd } from "./CompanyAdd.jsx";
import { NotFound } from "../NotFound.jsx";
import { Head } from "@inertiajs/inertia-react";

export default function CompanySearch({ url }) {
  const {
    data,
    show,
    notFound,
    errors,
    isSingle,
    isBulkAdd,
    reportData,
    showReport,
    showVerify,
    isMultiple,
    selectedRow,
    isLoading,
    fetchedData,
    isReportLoading,
    handleShow,
    handleClose,
    setNotFound,
    setIsBulkAdd,
    handleSingle,
    setShowReport,
    changeHandler,
    submitHandler,
    setShowVerify,
    handleMultiple,
    handleShowReport,
    handleCloseReport,
    handleBulkButtonClick,
  } = useCompanySearch(url);

  return (
    <div>
      <>
        <Head title="Search Company" />

        <BulkUploadModal
          type={"company"}
          actionType={"user"}
          show={isBulkAdd}
          handleClose={() => setIsBulkAdd(false)}
        />

        {
          <CompanyReport
            showReport={showReport}
            handleCloseReport={handleCloseReport}
            selectedRow={selectedRow}
            reportData={reportData}
          />
        }

        <CompanyVerify
          show={showVerify}
          handleClose={() => setShowVerify(false)}
          setVerified={setShowReport}
          verification_type={"company"}
          url={"verify_company_otp"}
        />

        <CompanyAdd
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          isSingle={isSingle}
          handleSingle={handleSingle}
          isMultiple={isMultiple}
          handleMultiple={handleMultiple}
          url={"client-create-company"}
          action={"create"}
        />
      </>

      <div className="container-xl">
        <h4 className="bg-info text-white p-2 rounded rounded-5 text-center mb-4">
          Search Company
        </h4>

        <table className="table table-sm table-bordered border-2 bg-white">
          <thead className="position-sticky c-table-top bg-white c-z-5">
            <tr>
              <th colSpan={4}>
                <form className="d-flex gap-3 align-items-end p-2" onSubmit={submitHandler}>
                  <div>
                    <label className="form-label" htmlFor="searchValue">
                      Filter by Registered Name / Number
                    </label>

                    <input
                      className="form-control form-control"
                      value={data.searchValue}
                      onChange={changeHandler}
                      placeholder="search..."
                      name="searchValue"
                      id="searchValue"
                    />

                    {errors.searchValue && (
                      <small className="text-danger p-1">{errors.searchValue}</small>
                    )}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="searchParam">
                      Select filter Parameter
                    </label>

                    <select
                      name="searchParam"
                      id="searchParam"
                      className="form-select"
                      onChange={changeHandler}
                    >
                      <option value="registration_name">Registered Name</option>
                      <option value="registration_number">Registration Number</option>
                    </select>
                  </div>

                  <button type="submit" disabled={isLoading} className="btn btn-info text-white">
                    <i className="leading-icon material-icons">search</i>
                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ms-2">Searching..</span>
                      </>
                    ) : (
                      "Search"
                    )}
                  </button>

                  <BulkIconButton handleClick={handleBulkButtonClick} />
                </form>
              </th>
            </tr>

            <tr className="c-bg-light">
              <th className="px-3">Registered Name</th>
              <th className="px-3">Registration Number</th>
              <th className="px-3 text-center">Select</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>
                  <div className="custom-h-2 d-flex align-items-center justify-content-center p-5">
                    <span className="spinner-grow spinner-grow-sm me-2 text-info"></span>
                    <span>Searching..</span>
                  </div>
                </td>
              </tr>
            ) : (
              fetchedData?.length > 0 &&
              fetchedData.map((company) => (
                <tr key={company.id}>
                  <td className="px-3">{company.registration_name}</td>
                  <td className="px-3">{company.registration_number}</td>
                  <td className="text-center">
                    <button
                      disabled={isReportLoading}
                      className="btn btn-info text-white text-center justify-content-center w-100 btn-sm"
                      onClick={(e) => handleShowReport(e, company.id)}
                    >
                      {isReportLoading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm"></span>
                          <span className="ms-2">processing..</span>
                        </>
                      ) : (
                        "View"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {notFound && (
          <div className="d-flex justify-content-center bg-white p-4">
            <NotFound
              handleShow={handleShow}
              userType={"company"}
              searchValue={data.searchValue}
              handleCloseModal={() => setNotFound(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
