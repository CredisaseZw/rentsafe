import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';

export const ExternalEnquirerInputDialog = ({
  show,
  handleClose,
  handleShowReport,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enquirer, setEnquirer] = useState('');
  const [enquirers, setEnquirers] = useState([]);
  const [enquirerDetail, setEnquirerDetail] = useState({});
  const [enquirerCompany, setEnquirerCompany] = useState('');
  const [companyBranch, setCompanyBranch] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [debounce, setDebounce] = useState(null);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (enquirer.length > 0 && enquirerDetail?.individual_name !== enquirer) {
        setIsLoading(true);
        axios
          .post(reverseUrl('client_company_users'), { userName: enquirer })
          .then((response) => {
            if (response.data.status === 'failed') {
              setEnquirers([]);
            } else {
              setOpenDropdown(true);
              setEnquirers(response.data);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            toast.error('Error fetching enquirer details');
            setIsLoading(false);
          });
      }
    }, 300);

    if (enquirer.length > 0 && enquirer !== '') {
      clearTimeout(debounce);
      setDebounce(debounceFn);
    }
    return () => clearTimeout(debounce);
  }, [enquirer]);

  const submitHandler = () => {
    if (enquirer === '') {
      setErrors({
        enquirer: 'Please enter a name',
      });
      return;
    }
    if (enquirerCompany === '') {
      setErrors({
        enquirerCompany: 'Please enter a company name',
      });
      return;
    }

    setErrors({});
    handleClose();
    handleShowReport('external', enquirerDetail?.individual_id);
  };

  return (
    <Modal size="md" show={show} onHide={handleClose} centered>
      <div>
        <div className="card card-raised">
          <Modal.Header className="card-header bg-info px-4" closeButton>
            <div
              className="d-flex justify-content-between
                                align-items-center"
            >
              <div className="me-4">
                <h2 className="display-6 mb-0 text-white">
                  External Enquirer Details
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
                  <div className="row mb-4">
                    <div className="row">
                      <div className="col-12 position-relative">
                        <label className="form-label">Enquirer:</label>
                        <input
                          value={enquirer}
                          onChange={(e) => setEnquirer(e.target.value)}
                          type="text"
                          name="enquirer"
                          id="enquirer"
                          placeholder="Enquirer Name"
                          className="form-control form-control-sm"
                        />
                        {enquirers?.length > 0 && openDropdown && (
                          <div
                            className="bg-info"
                            style={{
                              borderRadius: '5px',
                              padding: '5px',
                              color: 'white',
                              fontSize: '16px',
                              width: '100%',
                              position: 'absolute',
                              top: '100%',
                              zIndex: '1000',
                              height: '200px',
                              overflowY: 'scroll',
                            }}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-grow spinner-grow-sm"></span>
                                <span className="ml-2">processing..</span>
                              </>
                            ) : (
                              <ul className="list-style-none">
                                {enquirers.map((enquirer, index) => (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      setEnquirerDetail(enquirer);
                                      setEnquirer(enquirer.individual_name);
                                      setEnquirerCompany(enquirer.company_name);
                                      setOpenDropdown(false);
                                    }}
                                    className="cursor-pointer text-white px-2 py-1 hover:bg-secondary"
                                  >
                                    {enquirer.individual_name} -{' '}
                                    {enquirer.company_name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {errors && (
                          <div className="text-danger mt-1">
                            {errors.enquirer}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label className="form-label">Enquirer Company:</label>
                        <input
                          value={enquirerCompany}
                          onChange={(e) => setEnquirerCompany(e.target.value)}
                          type="text"
                          name="enquirer_company}"
                          id="enquirer_company}"
                          placeholder="Enquirer Company"
                          className="form-control form-control-sm"
                        />

                        {errors && (
                          <div className="text-danger mt-1">
                            {errors.enquirerCompany}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label className="form-label">Company Branch:</label>
                        <input
                          value={companyBranch}
                          onChange={(e) => setCompanyBranch(e.target.value)}
                          type="text"
                          name="company_branch"
                          id="company_branch"
                          placeholder="Company Branch"
                          className="form-control form-control-sm"
                        />
                        {errors && (
                          <div className="text-danger mt-1">
                            {errors.companyBranch}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="text-white"
                    variant="info"
                    onClick={submitHandler}
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
