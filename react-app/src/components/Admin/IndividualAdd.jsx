import { useForm } from "@inertiajs/inertia-react";
import axios from "axios";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { validateZimbabweanID, validateZimbabweanPassport } from "../../utils";
import { MultipleUpload } from "../MultipleUpload.jsx";

export default function IndividualAdd({
  show,
  handleClose,
  setAddSuccessful,
  handleSingle,
  isSingle,
  isMultiple,
  handleMultiple,
  url,
  action,
  userDetails,
  setFetchedData,
}) {
  // const { errors } = usePage().props;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const { data, setData, post, reset } = useForm({
    firstName: userDetails?.firstname || "",
    lastName: userDetails?.surname || "",
    identificationNumber: userDetails?.identification_number || "",
    identificationType: userDetails?.identification_type || "",
    gender: userDetails?.gender || "",
    dob: userDetails?.dob || "",
    maritalStatus: userDetails?.marital_status || "",
    address: userDetails?.address || "",
    mobileNumber: userDetails?.mobile || "",
    landLine: userDetails?.landline || "",
    emailAddress: userDetails?.email || "",
    currentEmployer: userDetails?.employer_name || "",
    jobTitle: userDetails?.job_title || "",
    dateOfemployment: userDetails?.date_of_employment || "",
    individualId: userDetails?.id || -1,
  });
  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  const handleSubmitIndividual = (e) => {
    e.preventDefault();
    if (
      data.mobileNumber.length < 10 ||
      data.mobileNumber.length > 13 ||
      /\D/.test(data.mobileNumber)
    ) {
      toast.error("Mobile number must be between 10 and 13 digits");
      return;
    }
    if (
      data.emailAddress !== "" &&
      !/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.emailAddress)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (
      data.identificationType === "passport" &&
      !validateZimbabweanPassport(data.identificationNumber)
    ) {
      setIsLoading(false);
      toast.error("Invalid passport number");
      return;
    } else if (
      data.identificationType === "nationalid" &&
      !validateZimbabweanID(data.identificationNumber)
    ) {
      setIsLoading(false);
      toast.error("Invalid national id number");
      return;
    }
    if (data.identificationType === "servicesid") {
      toast.error("Service ID not supported yet. Please use passport or national ID");
      return;
    }
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        // reset();
      },
      onSuccess: (response) => {
        reset();
        toast.success("User created successfully");
        setIsLoading(false);
        handleClose();
        setAddSuccessful(true);
      },
      onError: (e) => {
        toast.error("Something went wrong! Please try again");
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  const handleUpdateIndividual = (e) => {
    e.preventDefault();
    axios.post(reverseUrl("edit_individual_user"), data).then((response) => {
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setFetchedData((prev) => {
          const oldData = prev.filter((item) => item.id !== data.individualId);
          return [
            ...oldData,
            {
              id: data.individualId,
              firstname: data.firstName,
              surname: data.lastName,
              identification_number: data.identificationNumber,
              identification_type: data.identificationType,
              gender: data.gender,
              dob: data.dob,
              marital_status: data.maritalStatus,
              address: data.address,
              mobile: data.mobileNumber,
              land_line: data.landLine,
              email_address: data.emailAddress,
              employer_name: data.currentEmployer,
              job_title: data.jobTitle,
              date_of_employment: data.dateOfemployment,
            },
          ];
        });
        handleClose();
      } else {
        toast.error("Something went wrong! Please try again");
        handleClose();
      }
    });
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <div>
          <Modal.Header
            closeButton
            className="card-header bg-transparent"
            style={{ paddingLeft: "0px" }}
          >
            <div className="">
              <button
                className={`btn  btn-sm ${isSingle ? "btn-info text-white" : "btn-light"}`}
                onClick={handleSingle}
              >
                Single
              </button>
              <button
                className={`btn  btn-sm ${isMultiple ? "btn-info text-white" : "btn-light"}`}
                onClick={handleMultiple}
              >
                Multiple
              </button>
            </div>
          </Modal.Header>
          {isSingle ? (
            <div className="card card-raised">
              <div className="card-header bg-info">
                <div
                  className="d-flex justify-content-between
                      align-items-center"
                >
                  <div className="me-4">
                    <h2 className="display-6 mb-0 text-white">
                      {action === "create" ? "Add Individual" : "Edit Individual"}
                    </h2>
                    <div className="card-text"></div>
                  </div>
                  <div className="d-flex gap-2"></div>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="card">
                  <div
                    className="card-header bg-info px-4"
                    style={{ paddingTop: "2px", paddingBottom: "2px" }}
                  >
                    <div
                      className="d-flex justify-content-center
                            align-items-center"
                    >
                      <div className="me-4">
                        <h6 className="display-6 mb-0 text-white">Personal details</h6>
                        <div className="card-text"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card-body p-4"
                    style={{
                      borderStyle: "solid",
                      borderColor: "#26a69a",
                    }}
                  >
                    <Modal.Body>
                      <h5
                        style={{
                          backgroundColor: "#dda196",
                          padding: "5px 10px",
                          textAlign: "center",
                          borderRadius: "5px",
                        }}
                      >
                        <span className="fw-bold">Note</span>: All fields marked with a star (
                        <span className="text-danger">*</span>) are required.
                      </h5>
                      <div className="row">
                        <div className="col-md-12 my-4">
                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">
                                Surname<span className="text-danger">*</span>
                              </label>
                              <input
                                value={data.lastName}
                                onChange={changeHandler}
                                type="text"
                                name="lastName"
                                required
                                id="lastName"
                                placeholder="Enter last name"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.lastName}</div>}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">
                                First Name<span className="text-danger">*</span>
                              </label>
                              <input
                                value={data.firstName}
                                onChange={changeHandler}
                                type="text"
                                name="firstName"
                                required
                                id="firstName"
                                placeholder="Enter first name"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.firstName}</div>}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Identification Type
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select form-select-sm"
                                aria-label="Default select example"
                                name="identificationType"
                                id="identificationType"
                                required
                                onChange={changeHandler}
                                value={data.identificationType}
                              >
                                <option>Select...</option>
                                <option value="nationalid">National ID</option>
                                <option value="passport">Passport</option>
                                <option value="servicesid">Service ID</option>
                              </select>
                              {errors && (
                                <div className="text-danger mt-1">{errors.identificationType}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">
                                Identification Number
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                value={data.identificationNumber}
                                onChange={changeHandler}
                                type="text"
                                required
                                name="identificationNumber"
                                id="identificationNumber"
                                placeholder="eg. 12345678K29"
                                className="form-control form-control-sm"
                              />
                              {errors && (
                                <div className="text-danger mt-1">
                                  {errors.identificationNumber}
                                </div>
                              )}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Gender</label>
                              <select
                                className="form-select form-select-sm"
                                aria-label="Default select example"
                                onChange={changeHandler}
                                id="gender"
                                name="gender"
                                value={data.gender}
                              >
                                <option>Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                              {errors && <div className="text-danger mt-1">{errors.gender}</div>}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Date Of birth</label>
                              <input
                                value={data.dob}
                                onChange={changeHandler}
                                type="date"
                                name="dob"
                                id="dob"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.dob}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">Marital Status</label>
                              <select
                                className="form-select form-select-sm"
                                aria-label="Default select example"
                                name="maritalStatus"
                                onChange={changeHandler}
                                id="maritalStatus"
                                value={data.maritalStatus}
                              >
                                <option>Select...</option>
                                <option value="single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Other">Other</option>
                              </select>
                              {errors && (
                                <div className="text-danger mt-1">{errors.maritalStatus}</div>
                              )}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">
                                Address<span className="text-danger">*</span>
                              </label>
                              <textarea
                                value={data.address}
                                onChange={changeHandler}
                                type="text"
                                id="address"
                                required
                                name="address"
                                placeholder="eg. 12 Main Road"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.address}</div>}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Mobile Number
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                value={data.mobileNumber}
                                onChange={changeHandler}
                                type="tel"
                                name="mobileNumber"
                                id="mobileNumber"
                                required
                                maxLength={13}
                                placeholder="eg. 263777123456"
                                className="form-control form-control-sm"
                              />
                              {errors && (
                                <div className="text-danger mt-1">{errors.mobileNumber}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">Landline</label>
                              <input
                                value={data.landLine}
                                onChange={changeHandler}
                                type="tel"
                                id="landLine"
                                name="landLine"
                                placeholder="eg. 263 123 4567"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.landLine}</div>}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Email Address</label>
                              <input
                                value={data.emailAddress}
                                onChange={changeHandler}
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                placeholder="eg. your-name@your-company.com"
                                className="form-control form-control-sm"
                              />
                              {errors && (
                                <div className="text-danger mt-1">{errors.emailAddress}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div
                          className="card-header bg-info px-4"
                          style={{ paddingTop: "2px", paddingBottom: "2px" }}
                        >
                          <div
                            className="d-flex justify-content-center
                            align-items-center"
                          >
                            <div className="me-4">
                              <h6 className="display-6 mb-0 text-white">Employment Details</h6>
                              <div className="card-text"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4 mt-4">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">Current Employer</label>
                              <input
                                value={data.currentEmployer}
                                onChange={changeHandler}
                                type="text"
                                id="currentEmployer"
                                name="currentEmployer"
                                placeholder="eg. Your Current Company"
                                className="form-control form-control-sm"
                              />
                              {errors && (
                                <div className="text-danger mt-1">{errors.currentEmployer}</div>
                              )}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Current Job Title</label>
                              <input
                                value={data.jobTitle}
                                onChange={changeHandler}
                                type="text"
                                name="jobTitle"
                                id="jobTitle"
                                placeholder="eg. Accounts Clerk"
                                className="form-control form-control-sm"
                              />
                              {errors && <div className="text-danger mt-1">{errors.jobTitle}</div>}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Date of Employment</label>
                              <input
                                value={data.dateOfemployment}
                                onChange={changeHandler}
                                type="date"
                                id="dateOfemployment"
                                name="dateOfemployment"
                                className="form-control form-control-sm"
                              />
                              {errors && (
                                <div className="text-danger mt-1">{errors.dateOfemployment}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="text-white"
                        variant="info"
                        onClick={
                          action === "create" ? handleSubmitIndividual : handleUpdateIndividual
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-grow spinner-grow-sm"></span>
                            <span className="ml-2">processing..</span>
                          </>
                        ) : (
                          "Save and Proceed"
                        )}
                      </Button>
                      {/* <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button> */}
                    </Modal.Footer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <MultipleUpload type="individual" actionType="user" />
          )}
        </div>
      </Modal>
    </>
  );
}
