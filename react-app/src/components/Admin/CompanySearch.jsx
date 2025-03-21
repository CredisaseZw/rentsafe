import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/inertia-react";
import axios from "axios";
import toast from "react-hot-toast";
import { NotFound } from "../NotFound.jsx";
import PageHeader from "../PageHeader.jsx";
import { CompanyAdd } from "./CompanyAdd.jsx";
import CompanyReport from "./Report/CompanyReport.jsx";
import ConfirmEnquirerType from "./ConfirmEnquirerType.jsx";
import { ExternalEnquirerInputDialog } from "./ExternalEnquirerInputDialog.jsx";

export default function CompanySearch({ url }) {
  const [addSuccessful, setAddSuccessful] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [btnAdd, setBtnAdd] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [reportData, setReportData] = useState();
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEnquirerDialog, setShowEnquirerDialog] = useState(false);
  const [showExternalEnquirerDialog, setShowExternalEnquirerDialog] = useState(false);
  const handleCloseReport = () => setShowReport(false);
  const [companyId, setCompanyId] = useState();

  const { is_internal } = usePage().props?.Auth;

  const [selectedRow, setSelectedRow] = useState(null);

  const handleShowEnquirerDialog = (e, id) => {
    e.preventDefault();
    setShowEnquirerDialog(true);
    setCompanyId(id);
  };

  const handleShowReport = (enquirerType, externalUserId) => {
    setIsReportLoading(true);
    try {
      if (companyId && enquirerType === "internal") {
        axios
          .post(reverseUrl("enquiry_count"), {
            isIndividual: false,
            isCompany: true,
            companyId,
            isInternal: true,
          })
          .then((res) => {});
        axios
          .post(reverseUrl("company-report"), { companyId })
          .then((res) => {
            setSelectedRow(companyId);
            setShowReport(true);
            setReportData(res.data);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      } else if (companyId && enquirerType === "external") {
        axios
          .post(reverseUrl("enquiry_count"), {
            isIndividual: false,
            isCompany: true,
            isInternal: false,
            companyId,
          })
          .then((res) => {});
        axios
          .post(reverseUrl("company-report"), {
            companyId,
            enquirerId: externalUserId,
          })
          .then((res) => {
            setSelectedRow(companyId);
            setShowReport(true);
            setReportData(res.data);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleSingle = () => {
    setIsSingle(true);
    setIsMultiple(false);
  };

  const handleMultiple = () => {
    setIsMultiple(true);
    setIsSingle(false);
  };

  const { data, setData, post } = useForm({
    searchParam: "registration_name",
    searchValue: "",
  });

  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (data.searchValue === "") {
      setErrors({
        searchValue: "Please enter a search value",
      });
      setBtnAdd(false);
      setNotFound(false);
      return;
    }
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setNotFound(false);
        setBtnAdd(false);
        setErrors({});
        setFetchedData({});
      },
      onSuccess: (response) => {
        if (response.props.result.length > 0) {
          setFetchedData(response.props.result);
        } else {
          setBtnAdd(true);
          setNotFound(true);
        }
        setIsLoading(false);
      },
      onError: (e) => {
        toast.error("Nothing to search...");

        setIsLoading(false);
      },
    });
  };
  return (
    <main>
      <PageHeader title={"Search Company"} />
      <div className="container-xl p-5">
        <div className="row align-items-center mb-5">
          <div className="col-12 col-md-auto">
            <form className="mb-5" onSubmit={submitHandler}>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <div>
                  <label className="form-label" htmlFor="">
                    Filter by Registration Name / Number
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
                    <option value="registration_name">Registration Name</option>
                    <option value="registration_number">Registration Number</option>
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
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {reportData && (
          <CompanyReport
            showReport={showReport}
            handleCloseReport={handleCloseReport}
            selectedRow={selectedRow}
            reportData={reportData}
          />
        )}

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

        <CompanyAdd
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          isSingle={isSingle}
          pageType={"dashboard"}
          handleSingle={handleSingle}
          isMultiple={isMultiple}
          handleMultiple={handleMultiple}
          setAddSuccessful={setAddSuccessful}
          action={"create"}
          url={is_internal !== 1 ? "client-create-company" : "create-company"}
        />
        {/* {addSuccessful && (
          <CompanyVerify
            show={addSuccessful}
            setShow={setShow}
            handleClose={() => setAddSuccessful(false)}
            url={
              is_internal == 1
                ? 'client-company-verify-otp'
                : 'company_verify_otp'
            }
            verification_type={'company'}
          />
        )} */}
        <div className="card card-raised">
          <div className="card-body p-4">
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
              <div className="datatable-container">
                <table className="table table-striped">
                  <tbody>
                    <tr style={{ backgroundColor: "#e4e4e4" }}>
                      <th scope="col">Registration Name</th>
                      <th scope="col">Registration Number</th>
                      <th scope="col">Select</th>
                    </tr>

                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">searching..</span>
                      </>
                    ) : fetchedData.length > 0 ? (
                      fetchedData?.map(({ id, registration_number, registration_name }) => {
                        return (
                          <tr key={id}>
                            <th scope="row">{registration_name}</th>
                            <td>{registration_number}</td>
                            <td>
                              {id ? (
                                <button
                                  className="btn text-white  btn-info mdc-ripple-upgraded"
                                  type="submit"
                                  disabled={isReportLoading}
                                  onClick={(e) => handleShowEnquirerDialog(e, id)}
                                >
                                  {isReportLoading ? (
                                    <>
                                      <span className="spinner-grow spinner-grow-sm"></span>
                                      <span className="ml-2">processing..</span>
                                    </>
                                  ) : (
                                    "View"
                                  )}
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
                {/* Modal component */}

                <div className="row justify-content-center">
                  <div className="col-md-auto">
                    {notFound && (
                      <NotFound
                        handleShow={handleShow}
                        searchValue={data.searchValue}
                        userType={"Company"}
                        handleCloseModal={() => setNotFound(false)}
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
