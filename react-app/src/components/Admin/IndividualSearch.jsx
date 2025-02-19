import React, { useState } from 'react';

// import { Add } from './Add.jsx';
import { Toaster } from 'react-hot-toast';
import { NotFound } from '../NotFound.jsx';

import { useForm, usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
// import Report from './Report.jsx';
import BulkIconButton from '../BulkIconButton.jsx';
import PageHeader from '../PageHeader.jsx';
import IndividualAdd from './IndividualAdd.jsx';
// import { IndividualVerify } from './OTP/IndividualVerify.jsx';
import IndividualReport from './Report/IndividualReport.jsx';
import ConfirmEnquirerType from './ConfirmEnquirerType.jsx';
import { ExternalEnquirerInputDialog } from './ExternalEnquirerInputDialog.jsx';
export default function IndividualSearch({ individuals, url }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [addSuccessful, setAddSuccessful] = useState(false);
  const handleShow = () => setShow(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnAdd, setBtnAdd] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const handleCloseReport = () => setShowReport(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [reportData, setReportData] = useState();
  const [errors, setErrors] = useState({});
  const [showEnquirerDialog, setShowEnquirerDialog] = useState(false);
  const [showExternalEnquirerDialog, setShowExternalEnquirerDialog] =
    useState(false);
  const [companyId, setCompanyId] = useState();
  const { is_internal } = usePage().props.Auth;

  const handleSingle = () => {
    setIsSingle(true);
    setIsMultiple(false);
  };

  const handleMultiple = () => {
    setIsMultiple(true);
    setIsSingle(false);
  };

  const handleShowEnquirerDialog = (e, id) => {
    e.preventDefault();
    setShowEnquirerDialog(true);
    setCompanyId(id);
  };

  const handleShowReport = (enquirerType, externalUserId) => {
    try {
      setIsReportLoading(true);
      if (companyId && enquirerType === 'internal') {
        axios
          .post(reverseUrl('enquiry_count'), {
            isIndividual: true,
            isCompany: false,
            isInternal: true,
            individualId: companyId,
          })
          .then((res) => {});
        axios
          .post(reverseUrl('individual-report'), { individualId: companyId })
          .then((res) => {
            setSelectedRow(companyId);
            setShowReport(true);
            setReportData(res.data);
          })
          .catch((error) => {
            console.error('There was an error!', error);
          });
      } else if (companyId && enquirerType === 'external') {
        axios
          .post(reverseUrl('enquiry_count'), {
            isIndividual: true,
            isCompany: false,
            isInternal: false,
            individualId: companyId,
          })
          .then((res) => {});
        axios
          .post(reverseUrl('individual-report'), {
            individualId: companyId,
            enquirerId: externalUserId,
          })
          .then((res) => {
            setSelectedRow(companyId);
            setShowReport(true);
            setReportData(res.data);
          })
          .catch((error) => {
            console.error('There was an error!', error);
          });
      }
    } finally {
      setIsReportLoading(false);
    }
  };
  const { data, setData, post } = useForm({
    searchParam: 'fullname',
    searchValue: '',
  });
  const changeHandler = (e) =>
    setData({ ...data, [e.target.id]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (data.searchValue === '') {
      setErrors({
        searchValue: 'Please enter a search value',
      });
      setBtnAdd(false);
      setNotFound(false);
      return;
    }
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setBtnAdd(false);
        setNotFound(false);
        setFetchedData([]);
        setErrors({});
      },
      onSuccess: (response) => {
        //This will return true if the object is empty, otherwise false
        const isObjectEmpty = (objectName) => {
          return JSON.stringify(objectName) === '{}';
        };
        response.props.result.length === 0 && setNotFound(true);
        if (isObjectEmpty(response.props.result) === true) {
          setBtnAdd(true);
        } else {
          setFetchedData(response.props.result);
        }

        setIsLoading(false);
      },
      onError: (e) => {
        setIsLoading(false);
      },
    });
  };
  return (
    <main>
      <PageHeader title={'Search Individual'} />
      <div className="container-xl p-5">
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <div className="row align-items-center mb-5">
          <div className="col-12 col-md-auto">
            <form className="mb-5" onSubmit={submitHandler}>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <div>
                  <label className="form-label" htmlFor="">
                    Filter by Name / Surname / ID
                  </label>
                  <input
                    value={data.searchValue}
                    onChange={changeHandler}
                    type="text"
                    name="searchValue"
                    id="searchValue"
                    className="form-control form-control"
                  />
                  {errors.searchValue && (
                    <small className="text-danger">{errors.searchValue}</small>
                  )}
                </div>
                <div>
                  <label className="form-label" htmlFor="">
                    Select filter Parameter
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="searchParam"
                    id="searchParam"
                    onChange={changeHandler}
                  >
                    <option value="fullname">Full name</option>
                    <option value="nationalid">National ID</option>
                  </select>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-raised-info text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    <i className="leading-icon material-icons">search</i>
                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">Searching..</span>
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <BulkIconButton />
                </div>
                {/* <DefaultButton type="button" title="Ok"/> */}
              </div>
            </form>
          </div>
        </div>
        <IndividualReport
          showReport={showReport}
          handleCloseReport={handleCloseReport}
          selectedRow={selectedRow}
          reportData={reportData}
        />
        <IndividualAdd
          show={show}
          isMultiple={isMultiple}
          isSingle={isSingle}
          handleMultiple={handleMultiple}
          handleSingle={handleSingle}
          handleClose={handleClose}
          setAddSuccessful={setAddSuccessful}
          action={'create'}
          // url={'client-create-individual'}
          url={
            is_internal !== 1 ? 'client-create-individual' : 'create-individual'
          }
        />
        {showEnquirerDialog && (
          <ConfirmEnquirerType
            show={showEnquirerDialog}
            handleClose={() => setShowEnquirerDialog(false)}
            setShowEnquirerInputDialog={setShowExternalEnquirerDialog}
            handleShowReport={handleShowReport}
          />
        )}

        {showExternalEnquirerDialog && (
          <ExternalEnquirerInputDialog
            show={showExternalEnquirerDialog}
            handleClose={() => setShowExternalEnquirerDialog(false)}
            handleShowReport={handleShowReport}
          />
        )}

        <div className="card card-raised">
          <div className="card-body p-4">
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
              <div className="datatable-container">
                <table className="table table-striped">
                  <tbody>
                    <tr style={{ backgroundColor: '#e4e4e4' }}>
                      <th scope="col">Forenames</th>
                      <th scope="col">surname</th>
                      <th scope="col">National ID</th>
                      <th scope="col">Select</th>
                    </tr>

                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">searching..</span>
                      </>
                    ) : (
                      fetchedData.length > 0 &&
                      fetchedData.map((fetchedData) => (
                        <tr key={fetchedData.id}>
                          <th scope="row">{fetchedData.firstname}</th>
                          <td>{fetchedData.surname}</td>
                          <td>{fetchedData.national_id}</td>
                          <td>
                            <button
                              className="btn text-white  btn-info mdc-ripple-upgraded"
                              type="submit"
                              disabled={isReportLoading}
                              onClick={(e) =>
                                handleShowEnquirerDialog(e, fetchedData.id)
                              }
                            >
                              {isReportLoading ? (
                                <>
                                  <span className="spinner-grow spinner-grow-sm"></span>
                                  <span className="ml-2">processing..</span>
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
                <div className="row justify-content-center">
                  <div className="col-md-auto">
                    {notFound && (
                      <NotFound
                        handleShow={handleShow}
                        handleCloseModal={() => setNotFound(false)}
                        userType={'Individual'}
                        searchValue={data.searchValue}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="datatable-bottom">
                <div className="datatable-info"></div>
                <nav className="datatable-pagination"></nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
