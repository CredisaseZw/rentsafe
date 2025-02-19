import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useForm, usePage } from '@inertiajs/inertia-react';
import toast, { Toaster } from 'react-hot-toast';
import { MultipleUpload } from '../MultipleUpload.jsx';
import { industries } from '../../constants/index.js';
import axios from 'axios';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');

  const { data, setData, post, reset } = useForm({
    registeredName: companyData ? companyData.registration_name : '',
    tradingName: companyData ? companyData.trading_name : '',
    branch: companyData ? companyData.branch : '',
    companyRegistrationNumber: companyData
      ? companyData.registration_number
      : '',

    registrationDate: companyData ? companyData.registration_date : '',
    vatNumber: companyData ? companyData.vat_number : '',
    currentAddress: companyData ? companyData.address : '',
    landLine: companyData ? companyData.landline : '',
    mobileNumber: companyData ? companyData.mobile_phone : '',
    emailAddress: companyData ? companyData.email : '',
    website: companyData ? companyData.website : '',
    industry: companyData ? companyData.industry : '',
    note: companyData ? companyData.note : '',
    is_gvt: companyData ? companyData.is_government : false,
    company_id: companyData ? companyData.id : '',
    is_contracted: companyData ? companyData.is_contracted : false,
  });
  const changeHandler = (e) => {
    if (e.target.id === 'is_gvt') {
      setData({ ...data, [e.target.id]: e.target.checked });
    } else {
      setData({ ...data, [e.target.id]: e.target.value });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    data.registeredName =
      data.branch !== '' && !data.registeredName.split(' - ').at(-1)?.length
        ? data.registeredName + ' - ' + data.branch
        : data.registeredName;
    axios.post(reverseUrl('edit_company_user'), data).then((res) => {
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setFetchedData((prev) => {
          const oldData = prev.filter(
            (company) => company.id !== data.company_id
          );
          return [
            ...oldData,
            {
              id: data.company_id,
              registration_name: data.registeredName,
              trading_name: data.tradingName,
              registration_number: data.companyRegistrationNumber,
              registration_date: data.registrationDate,
              vat_number: data.vatNumber,
              address: data.currentAddress,
              landline: data.landLine,
              mobile_phone: data.mobileNumber,
              email: data.emailAddress,
              website: data.website,
              industry: data.industry,
              note: data.note,
            },
          ];
        });
        handleClose();
      } else {
        toast.error(
          res.data?.message || 'Something went wrong! Please try again'
        );
        handleClose();
      }
    });
  };

  const handleSubmitIndividual = (e) => {
    e.preventDefault();
    data.registeredName =
      data.branch !== ''
        ? data.registeredName + ' - ' + data.branch
        : data.registeredName;
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
        setErrors('');
      },
      onSuccess: (response) => {
        reset();
        if (response.props.success) {
          toast.success(response.props.success);
          setIsLoading(false);
          handleClose();
        } else {
          toast.error(response.props.error);
        }
      },
      onError: (e) => {
        toast.error('Something went wrong! Please try again');
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <div className="card">
          <Modal.Header
            closeButton
            className="card-header bg-transparent"
            style={{ paddingLeft: '0px' }}
          >
            <div className="">
              <button
                className={`btn  btn-sm ${
                  isSingle ? 'btn-info text-white' : 'btn-light'
                }`}
                onClick={handleSingle}
              >
                Single
              </button>
              <button
                className={`btn  btn-sm ${
                  isMultiple ? 'btn-info text-white' : 'btn-light'
                }`}
                onClick={handleMultiple}
              >
                Multiple
              </button>
            </div>
          </Modal.Header>
          <div
            className="card-body"
            style={{
              padding: '0px',
              borderStyle: 'solid',
              borderColor: '#26a69a',
            }}
          >
            {/* add individual company  */}
            {isSingle ? (
              <div>
                <div className="card card-raised">
                  <div className="card-header bg-info">
                    <div
                      className="d-flex justify-content-between
                            align-items-center"
                    >
                      <div className="me-4">
                        <h2 className="display-6 mb-0 text-white">
                          {action === 'create' ? 'Add Company' : 'Edit Company'}
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
                        style={{ paddingTop: '2px', paddingBottom: '2px' }}
                      >
                        <div
                          className="d-flex justify-content-center
                            align-items-center"
                        >
                          <div className="me-4">
                            <h6 className="display-6 mb-0 text-white">
                              Company details
                            </h6>
                            <div className="card-text"></div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-body p-4"
                        style={{
                          borderStyle: 'solid',
                          borderColor: '#26a69a',
                        }}
                      >
                        <Modal.Body>
                          <h5
                            style={{
                              backgroundColor: '#dda196',
                              padding: '5px 10px',
                              textAlign: 'center',
                              borderRadius: '5px',
                            }}
                          >
                            <span className="fw-bold">Note</span>: All fields
                            marked with a star (
                            <span className="text-danger">*</span>) are
                            required.
                          </h5>
                          <div className="row">
                            <div className="col-md-12 my-4">
                              <div className="row">
                                <div className="col-md-4">
                                  <label className="form-label">
                                    Registered Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    value={data.registeredName}
                                    onChange={changeHandler}
                                    type="text"
                                    required
                                    name="registeredName"
                                    id="registeredName"
                                    placeholder="eg. Company Name"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.registeredName}
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  <label className="form-label">
                                    Trading Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    value={data.tradingName}
                                    onChange={changeHandler}
                                    type="text"
                                    required
                                    name="tradingName"
                                    id="tradingName"
                                    placeholder="eg. Company Name"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.tradingName}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Branch</label>
                                  <input
                                    value={data.branch}
                                    onChange={changeHandler}
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    placeholder="Company Branch"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.branch}
                                    </div>
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
                                    Registration Number
                                  </label>
                                  <input
                                    value={data.companyRegistrationNumber}
                                    onChange={changeHandler}
                                    type="text"
                                    name="companyRegistrationNumber"
                                    id="companyRegistrationNumber"
                                    placeholder="eg. 000/984/2020"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.companyRegistrationNumber}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">
                                    Registration Date
                                  </label>
                                  <input
                                    value={data.registrationDate}
                                    onChange={changeHandler}
                                    type="date"
                                    name="registrationDate"
                                    id="registrationDate"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.registrationDate}
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  <label className="form-label">
                                    VAT Number
                                  </label>
                                  <input
                                    value={data.vatNumber}
                                    onChange={changeHandler}
                                    type="text"
                                    name="vatNumber"
                                    id="vatNumber"
                                    placeholder="eg. 1123456789"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.vatNumber}
                                    </div>
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
                                    Current Address
                                    <span className="text-danger">*</span>
                                  </label>
                                  <textarea
                                    value={data.currentAddress}
                                    onChange={changeHandler}
                                    type="text"
                                    name="currentAddress"
                                    required
                                    rows="2"
                                    placeholder="eg. 1234 Main St"
                                    id="currentAddress"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.currentAddress}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">
                                    Telephone Number
                                  </label>
                                  <input
                                    value={data.landLine}
                                    onChange={changeHandler}
                                    type="tel"
                                    placeholder="123-456-7890"
                                    name="landLine"
                                    id="landLine"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.landLine}
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  <label className="form-label">
                                    Mobile Number
                                  </label>
                                  <input
                                    value={data.mobileNumber}
                                    onChange={changeHandler}
                                    type="tel"
                                    placeholder='eg. "263712345612"'
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.mobileNumber}
                                    </div>
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
                                    Email Address
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    value={data.emailAddress}
                                    onChange={changeHandler}
                                    type="email"
                                    required
                                    name="emailAddress"
                                    placeholder="your-name@company-name.com"
                                    id="emailAddress"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.emailAddress}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Website</label>
                                  <input
                                    value={data.website}
                                    onChange={changeHandler}
                                    type="url"
                                    id="website"
                                    name="website"
                                    placeholder="https://your-website.com"
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.website}
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  <label className="form-label">Industry</label>
                                  <select
                                    className="form-select form-select-sm"
                                    aria-label="Default select example"
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
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.industry}
                                    </div>
                                  )}
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.industry}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="col-md-4 d-flex gap-2">
                                  <label className="form-label">
                                    Government Org
                                  </label>
                                  <input
                                    type="checkbox"
                                    name="is_gvt"
                                    id="is_gvt"
                                    checked={data.is_gvt}
                                    onChange={changeHandler}
                                    className="form-check-input border-1 border-black"
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Note</label>
                                  <textarea
                                    value={data.note}
                                    onChange={changeHandler}
                                    type="text"
                                    id="note"
                                    name="note"
                                    placeholder="Write your additional note here..."
                                    className="form-control form-control-sm"
                                  />
                                  {errors && (
                                    <div className="text-danger mt-1">
                                      {errors.note}
                                    </div>
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
                              action === 'create'
                                ? handleSubmitIndividual
                                : handleEdit
                            }
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
                          {/* <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button> */}
                        </Modal.Footer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            {/* upload bulk company */}
            {isMultiple ? (
              <MultipleUpload type={'company'} actionType={'user'} />
            ) : (
              ''
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
