import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const PeriodRequest = ({ show, handleClose, tenantData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, post, setData, errors } = useForm({
    tenantNumber: tenantData?.tenantNumber || '',
    name: tenantData?.name || '',
    adress: tenantData?.adress || '',
    startDate: '',
    endDate: '',
  });

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmitit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    post('/client/period-request', {
      onSuccess: () => {
        setIsLoading(false);
        handleClose();
      },
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
                  <h2 className="display-6 mb-0 text-white">
                    Tenant Statement Period Request
                  </h2>
                  <div className="card-text"></div>
                </div>
                <div className="d-flex gap-2"></div>
              </div>
            </Modal.Header>
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
                    <div className="row">
                      <h5
                        style={{
                          backgroundColor: '#dda196',
                          padding: '5px 10px',
                          textAlign: 'center',
                          borderRadius: '5px',
                        }}
                      >
                        <span className="fw-bold">Note</span>: All fields marked
                        with a star (<span className="text-danger">*</span>) are
                        required.
                      </h5>
                      <div className="col-md-12 my-4">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">
                              Tenant Number{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              value={data.tenantNumber}
                              onChange={changeHandler}
                              type="text"
                              name="tenantNumber"
                              required
                              id="tenantNumber"
                              placeholder="Enter tenant number"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.tenantNumber}
                              </div>
                            )}
                          </div>

                          <div className="col-md-4">
                            <label className="form-label">
                              Name<span className="text-danger">*</span>
                            </label>
                            <input
                              value={data.name}
                              onChange={changeHandler}
                              type="text"
                              name="name"
                              required
                              id="name"
                              placeholder="Enter tenant's full name"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.name}
                              </div>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">
                              Address
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              value={data.adress}
                              onChange={changeHandler}
                              type="text"
                              required
                              name="adress"
                              id="adress"
                              placeholder="Enter tenant's address"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.adress}
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
                              From
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              value={data.startDate}
                              onChange={changeHandler}
                              type="date"
                              name="startDate"
                              id="startDate"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.startDate}
                              </div>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">
                              To<span className="text-danger">*</span>
                            </label>
                            <input
                              value={data.endDate}
                              onChange={changeHandler}
                              type="date"
                              name="endDate"
                              id="endDate"
                              className="form-control form-control-sm"
                            />
                            {errors && (
                              <div className="text-danger mt-1">
                                {errors.endDate}
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
                      onClick={handleSubmitit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm"></span>
                          <span className="ml-2">processing..</span>
                        </>
                      ) : (
                        'Submit'
                      )}
                    </Button>
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

export default PeriodRequest;
