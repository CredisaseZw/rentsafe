import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm, usePage } from "@inertiajs/inertia-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function AgentAdd({
  show,
  handleClose,
  setAddSuccessful,
  url,
  userDetails,
  notFound,
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
    isAgent: userDetails?.is_agent || false,
  });
  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  const handleSubmitIndividual = (e) => {
    console.log("create agent..");
    e.preventDefault();
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        // reset();
      },
      onSuccess: (response) => {
        reset();
        toast.success("OTP has been sent to user");
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

  const handleActivateAgent = (e) => {
    console.log("activate agent..");
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(reverseUrl("activate-agent"), {
        userId: data.individualId,
      })
      .then((res) => {
        setIsLoading(false);
        handleClose();
        setAddSuccessful(true);
        console.log("success");
        console.log(res.data.status);
        if (res.data.status === "success") {
          toast.success("Agent Activated successfully");
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        console.log("error");

        setIsLoading(false);
        toast.error("Something went wrong! Please try again");
      });
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <div>
          <div className="card card-raised">
            <Modal.Header closeButton className="card-header bg-info px-4">
              <div
                className="d-flex justify-content-between
                            align-items-center"
              >
                <div className="me-4">
                  <h2 className="display-6 mb-0 text-white">Create Agent</h2>
                  <div className="card-text"></div>
                </div>
                <div className="d-flex gap-2"></div>
              </div>
            </Modal.Header>
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
                    <div className="row mb-4">
                      <div className="col-md-12">
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
                              <div className="text-danger mt-1">{errors.identificationNumber}</div>
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
                              placeholder="eg. 0777123456"
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
                            <label className="form-label">Date of Employement</label>
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
                    {notFound ? (
                      <Button
                        className="text-white"
                        variant="info"
                        onClick={handleSubmitIndividual}
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
                    ) : (
                      <>
                        {data.isAgent ? (
                          <Button className="text-white" variant="info" disabled={true}>
                            {isLoading ? (
                              <>
                                <span className="spinner-grow spinner-grow-sm"></span>
                                <span className="ml-2">processing..</span>
                              </>
                            ) : (
                              "De-activate"
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="text-white"
                            variant="info"
                            onClick={handleActivateAgent}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-grow spinner-grow-sm"></span>
                                <span className="ml-2">processing..</span>
                              </>
                            ) : (
                              "Activate Agent"
                            )}
                          </Button>
                        )}
                      </>
                    )}

                    {/* {data.isAgent ? (
                      <Button
                        className="text-white"
                        variant="info"
                        onClick={handleSubmitIndividual}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-grow spinner-grow-sm"></span>
                            <span className="ml-2">processing..</span>
                          </>
                        ) : (
                          'Save and Proceed'
                        )}
                      </Button>
                    ) : (
                      <Button
                        className="text-white"
                        variant="info"
                        onClick={handleActivateAgent}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-grow spinner-grow-sm"></span>
                            <span className="ml-2">processing..</span>
                          </>
                        ) : (
                          'Activate Agent'
                        )}
                      </Button>
                    )} */}
                    {/* <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button> */}
                  </Modal.Footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
