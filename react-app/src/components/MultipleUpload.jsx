import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from '@inertiajs/inertia-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const MultipleUpload = ({ type, actionType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorFileDownload, setErrorFileDownload] = useState('');

  const { data, setData, post, reset, progress } = useForm({
    csv_file: null,
  });

  const handleTemplateDownload = async () => {
    if (errorFileDownload !== '') {
      window.open(`/download_template/${errorFileDownload}`, '_blank');
      setErrorFileDownload('');
    } else if (type === 'individual') {
      if (actionType === 'user') {
        window.open('/download_template/individual_template.csv', '_blank');
      } else if (actionType === 'lease') {
        window.open(
          '/download_template/individual_lease_template.csv',
          '_blank'
        );
      }
    } else if (type === 'company') {
      if (actionType === 'user') {
        window.open('/download_template/company_template.csv', '_blank');
      } else if (actionType === 'lease') {
        window.open('/download_template/company_lease_template.csv', '_blank');
      }
    }
  };
  const handleSubmitIndividual = async (e) => {
    e.preventDefault();
    if (data.csv_file === null) {
      toast.error('Please select a file to upload');
      return;
    }
    const url =
      type === 'individual' && actionType === 'user'
        ? 'create_bulk_individuals'
        : type === 'company' && actionType === 'user'
          ? 'create_bulk_companies'
          : type === 'company' && actionType === 'lease'
            ? 'create_company_bulk_leases'
            : 'create_individual_bulk_leases';

    try {
      setIsLoading(true);
      setErrorFileDownload('');
      const response = await axios.post(reverseUrl(url), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'failed') {
        reset();
        setErrorFileDownload(response.data.file_path);
        toast.error(
          'Some records failed to be created. Download the returned file and try again'
        );
      } else {
        toast.success('All records created successfully');
      }
      setIsLoading(false);
    } catch (e) {
      toast.error('An error occurred. Please try again');
    }
  };
  return (
    <div>
      <div className="card card-raised">
        <div className="card-header bg-info">
          <div
            className="d-flex justify-content-between
                align-items-center"
          >
            <div className="me-4">
              <h2 className="display-6 mb-0 text-white">
                {type === 'individual' && actionType === 'user'
                  ? 'Multiple Individuals Uploader'
                  : type === 'company' && actionType === 'user'
                    ? 'Multiple Companies Uploader'
                    : type === 'company' && actionType === 'lease'
                      ? 'Multiple Company Lease Uploader'
                      : 'Multiple Individual Lease Uploader'}
              </h2>
              <div className="card-text"></div>
            </div>
            <div className="d-flex gap-2"></div>
          </div>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmitIndividual}>
            <div className="card">
              <div
                className="card-body p-4"
                style={{
                  border: '1px dashed #999',
                  borderColor: '#26a69a',
                  backgroundColor: 'rgb(239, 239, 239)',
                }}
                onClick={() => document.getElementById('csv_file').click()}
              >
                <Modal.Body>
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="text-center">
                        <div
                          className="material-icons"
                          style={{ color: '#26a69a', fontSize: '48px' }}
                        >
                          cloud_upload
                        </div>
                        <div>
                          {data.csv_file
                            ? data.csv_file.name
                            : 'Drag and drop files here, or browse your computer.'}
                        </div>
                        <input
                          className="form-control d-none"
                          id="csv_file"
                          type="file"
                          accept="text/csv"
                          onChange={(e) =>
                            setData('csv_file', e.target.files[0])
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  {/* {progress && (
                  <progress value={progress.percentage} max="100">
                    {progress.percentage}%
                  </progress>
                )} */}
                </Modal.Footer>
              </div>
              <div className="card-footer d-flex flex-row align-items-center justify-content-between">
                {errorFileDownload === '' ? (
                  <p>
                    Use the template provided{' '}
                    <a
                      onClick={handleTemplateDownload}
                      style={{ cursor: 'pointer' }}
                      className="text-info text-decoration-underline "
                    >
                      here
                    </a>
                  </p>
                ) : (
                  <p className="text-danger">
                    Download the error file{' '}
                    <a
                      onClick={handleTemplateDownload}
                      style={{ cursor: 'pointer' }}
                      className="text-info text-decoration-underline "
                    >
                      here
                    </a>
                  </p>
                )}
                <button
                  className="btn btn-raised-info text-white btn-sm"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span className="ml-2">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <i className="leading-icon material-icons">upload</i>
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
