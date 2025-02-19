import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useForm, usePage } from '@inertiajs/inertia-react';
import toast, { Toaster } from 'react-hot-toast';

export const ExternalUserForm = ({
  show,
  handleClose,
  action,
  receivedData,
  url,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');

  const { data, setData, post, put, reset } = useForm({
    firstName:
      Object.keys(receivedData).length > 0 ? receivedData.firstName : '',
    lastName: Object.keys(receivedData).length > 0 ? receivedData.lastName : '',
    identificationNumber:
      Object.keys(receivedData).length > 0
        ? receivedData.identificationNumber
        : '',
    identificationType:
      Object.keys(receivedData).length > 0
        ? receivedData.identificationType
        : '',
    mobileNumber:
      Object.keys(receivedData).length > 0 ? receivedData.mobile : '',
    userEmail: Object.keys(receivedData).length > 0 ? receivedData.email : '',
    accessLevel:
      Object.keys(receivedData).length > 0 ? receivedData.access_level : '',
    address: Object.keys(receivedData).length > 0 ? receivedData.address : '',
    userId: Object.keys(receivedData).length > 0 ? receivedData.userId : -1,
  });
  const changeHandler = (e) =>
    setData({ ...data, [e.target.id]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    post(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        reset();
        toast.success(`User ${data.firstName} created successfully`);
        setIsLoading(false);
      },
      onError: (e) => {
        console.log(e);
        toast.error('Something went wrong! Please try again');
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  const handleEdit = (e) => {
    console.log(data);
    e.preventDefault();
    put(reverseUrl(url), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        reset();
        toast.success(`User ${data.firstName} updated successfully`);
        setIsLoading(false);
      },
      onError: (e) => {
        console.log(e);
        toast.error('Something went wrong! Please try again');
        setErrors(e);
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <div>
          <div className="card card-raised">
            <div className="card-header bg-info px-4">
              <div
                className="d-flex justify-content-between
                align-items-center"
              >
                <div className="me-4">
                  <h2 className="display-6 mb-0 text-white">System User</h2>
                  <div className="card-text"></div>
                </div>
                <div className="d-flex gap-2"></div>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="card">
                <div
                  className="card-body p-4"
                  style={{
                    borderStyle: 'solid',
                    borderColor: '#26a69a',
                  }}
                >
                  <Modal.Body>
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="row">
                          <Toaster
                            position="top-right"
                            toastOptions={{ duration: 5000 }}
                          />
                          <div className="col-lg-4">
                            <label className="form-label">Surname</label>
                            <input
                              value={data.lastName}
                              onChange={changeHandler}
                              type="text"
                              placeholder="Surname"
                              required
                              name="lastName"
                              id="lastName"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.lastName}
                              </div>
                            )}
                          </div>

                          <div className="col-lg-4">
                            <label className="form-label">First Name</label>
                            <input
                              value={data.firstName}
                              onChange={changeHandler}
                              type="text"
                              placeholder="First Name"
                              required
                              name="firstName"
                              id="firstName"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.firstName}
                              </div>
                            )}
                          </div>
                          <div class="col-lg-4">
                            <label className="form-label">
                              Identification Type
                            </label>
                            <select
                              class="form-select form-select-sm"
                              aria-label="Default select example"
                              name="identificationType"
                              required
                              id="identificationType"
                              onChange={changeHandler}
                              value={data.identificationType}
                            >
                              <option>Select Type...</option>
                              <option value="nationalid">National ID</option>
                              <option value="passport">Passport</option>
                              <option value="servicesid">Service ID</option>
                            </select>
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.identificationType}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-lg-4">
                            <label className="form-label">
                              Identification Number
                            </label>
                            <input
                              value={data.identificationNumber}
                              onChange={changeHandler}
                              type="text"
                              required
                              placeholder="Identification Number"
                              name="identificationNumber"
                              id="identificationNumber"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.identificationNumber}
                              </div>
                            )}
                          </div>
                          <div className="col-lg-4">
                            <label className="form-label">Address</label>
                            <textarea
                              value={data.address}
                              onChange={changeHandler}
                              type="text"
                              placeholder="Address"
                              id="address"
                              required
                              name="address"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.address}
                              </div>
                            )}
                          </div>
                          <div className="col-lg-4">
                            <label className="form-label">Mobile Number</label>
                            <input
                              value={data.mobileNumber}
                              onChange={changeHandler}
                              required
                              placeholder="Mobile Number"
                              type="text"
                              name="mobileNumber"
                              id="mobileNumber"
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
                          <div className="col-lg-4">
                            <label className="form-label">Access Level</label>
                            <select
                              value={data.accessLevel}
                              onChange={changeHandler}
                              id="accessLevel"
                              required
                              name="accessLevel"
                              className="form-select form-select-sm"
                            >
                              <option>Select Level...</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.accessLevel}
                              </div>
                            )}
                          </div>
                          <div className="col-lg-4">
                            <label className="form-label">User Email</label>
                            <input
                              value={data.userEmail}
                              onChange={changeHandler}
                              type="email"
                              name="userEmail"
                              placeholder="eg. joe@rentsafe.com"
                              id="userEmail"
                              required
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.userEmail}
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
                      onClick={action === 'add' ? handleAdd : handleEdit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm"></span>
                          <span className="ml-2">processing..</span>
                        </>
                      ) : action === 'add' ? (
                        'Add User'
                      ) : (
                        'Update User'
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
      </Modal>
    </>
  );
};
