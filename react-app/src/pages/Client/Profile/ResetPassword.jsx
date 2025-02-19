import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../../components/Layouts/client/Layout.jsx';

const ResetPassword = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData, post } = useForm({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (data.oldPassword === '') {
      setErrors({ oldPassword: 'Please enter old password' });
      return;
    }
    if (data.newPassword === '') {
      setErrors({ newPassword: 'Please enter new password' });
      return;
    }
    post(reverseUrl('cl-change-password'), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        setIsLoading(false);
        if (response.props?.error) {
          toast.error(response.props?.error, {
            position: 'top-right',
            duration: 3000,
            style: {
              minWidth: '200px',
              padding: '10px 20px',
              borderRadius: '10px',
            },
            icon: '❌',
          });
          return;
        }
        toast.success(response.props?.success, {
          position: 'top-right',
          duration: 3000,
          style: {
            minWidth: '200px',
            padding: '10px 20px',
            borderRadius: '10px',
          },
          icon: '✔',
        });
      },
      onError: (error) => {
        setIsLoading(false);
        setErrors(error);
      },
    });
  };
  return (
    <div className="card card-raised">
      <div className="card-header bg-info px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="me-4">
            <h2 className="display-6 mb-0 text-white">Reset Password</h2>
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
                <h6 className="display-6 mb-0 text-white">Change Password</h6>
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
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">
                      Old Password<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.odlPassword}
                      onChange={changeHandler}
                      type="password"
                      name="oldPassword"
                      required
                      id="oldPassword"
                      placeholder="Enter old password"
                      className="form-control form-control-sm"
                    />
                    {errors && (
                      <div className="text-danger mt-1">
                        {errors.oldPassword}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      New Password<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.newPassword}
                      onChange={changeHandler}
                      type="password"
                      name="newPassword"
                      required
                      id="newPassword"
                      placeholder="Enter new password"
                      className="form-control form-control-sm"
                    />
                    {errors && (
                      <div className="text-danger mt-1">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Confirm Password
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      required
                      onChange={changeHandler}
                      value={data.confirmPassword}
                    />
                    {errors && (
                      <div className="text-danger mt-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
                <hr className="my-4 bg-info" style={{ height: '2px' }} />
                <button
                  onClick={submitHandler}
                  className="btn btn-raised-info d-flex align-items-center justify-content-center gap-2 text-white"
                  style={{ minWidth: '200px' }}
                >
                  <i className="material-icons">done</i>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResetPassword.layout = (page) => (
  <Layout children={page} title={'Reset Password'} />
);

export default ResetPassword;
