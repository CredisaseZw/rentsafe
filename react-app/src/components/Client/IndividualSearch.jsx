import { NotFound } from '../NotFound.jsx';
import IndividualAdd from './IndividualAdd.jsx';
import BulkIconButton from '../BulkIconButton.jsx';
import BulkUploadModal from '../BulkUploadModal.jsx';
import IndividualReport from './Report/IndividualReport.jsx';
import useIndividualSearch from '../../hooks/component-hooks/useIndividualSearch.js';
import { Head } from '@inertiajs/inertia-react';

export default function IndividualSearch({ url }) {
  const {
    show,
    data,
    errors,
    notFound,
    isSingle,
    isLoading,
    isBulkAdd,
    isMultiple,
    reportData,
    isVerified,
    selectedRow,
    fetchedData,
    isReportLoading,
    handleShow,
    setNotFound,
    handleClose,
    handleSingle,
    setIsBulkAdd,
    setIsVerified,
    changeHandler,
    submitHandler,
    handleMultiple,
    handleShowReport,
    handleBulkButtonClick,
  } = useIndividualSearch(url);

  return (
    <div>
      <>
        <Head title="Search Individual" />

        <BulkUploadModal
          type={'individual'}
          actionType={'user'}
          show={isBulkAdd}
          handleClose={() => setIsBulkAdd(false)}
        />

        {isVerified && (
          <IndividualReport
            showReport={isVerified}
            handleCloseReport={() => setIsVerified(false)}
            selectedRow={selectedRow}
            reportData={reportData}
          />
        )}

        <IndividualAdd
          show={show}
          isMultiple={isMultiple}
          isSingle={isSingle}
          handleMultiple={handleMultiple}
          handleSingle={handleSingle}
          handleClose={handleClose}
          action={'create'}
          url={'cl-store-individual'}
        />
      </>

      <div className="container-xl">
        <h4 className="bg-info text-white p-2 rounded rounded-5 text-center mb-4">
          Search Individual
        </h4>

        <table className="table table-sm table-bordered border-2 bg-white">
          <thead className="position-sticky c-table-top bg-white c-z-5">
            <tr>
              <th colSpan={4}>
                <form
                  className="d-flex gap-3 align-items-end p-2"
                  onSubmit={submitHandler}
                >
                  <div>
                    <label className="form-label" htmlFor="searchValue">
                      Filter by Name / Surname / ID
                    </label>

                    <input
                      name="searchValue"
                      id="searchValue"
                      value={data.searchValue}
                      onChange={changeHandler}
                      className="form-control"
                      placeholder="search..."
                    />

                    {errors.searchValue && (
                      <small className="text-danger p-1">
                        {errors.searchValue}
                      </small>
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
                      <option value="fullname">Full name</option>
                      <option value="nationalid">Identification Number</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-info text-white"
                  >
                    <i className="leading-icon material-icons">search</i>
                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ms-2">Searching..</span>
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>

                  <BulkIconButton handleClick={handleBulkButtonClick} />
                </form>
              </th>
            </tr>

            <tr className="c-bg-light">
              <th className="px-3">Forenames</th>
              <th className="px-3">surname</th>
              <th className="px-3">Identification Number</th>
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
              fetchedData.map((user) => (
                <tr key={user.id}>
                  <td className="px-3">{user.firstname}</td>
                  <td className="px-3">{user.surname}</td>
                  <td className="px-3">{user.national_id}</td>
                  <td className="text-center">
                    <button
                      disabled={isReportLoading}
                      className="btn btn-info text-white text-center justify-content-center w-100 btn-sm"
                      onClick={(e) => handleShowReport(e, user.id)}
                    >
                      {isReportLoading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm"></span>
                          <span className="ms-2">processing..</span>
                        </>
                      ) : (
                        'View'
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
              handleCloseModal={() => setNotFound(false)}
              userType={'individual'}
              searchValue={data.searchValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
