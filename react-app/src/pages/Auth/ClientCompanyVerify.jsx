import { useForm, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layouts/Auth/Layout.jsx';

export default function ClientCompanyVerify({ errors }) {
  const companyEmail = usePage().props.company_email;
  const companyName = usePage().props.company_name;
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, post } = useForm({
    username: companyEmail || '',
    password: '',
    confirmPassword: '',
  });
  const changeHandler = (e) =>
    setData({ ...data, [e.target.id]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    post(reverseUrl('client-company-verify-otp'), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        setIsLoading(false);
      },
      onError: (e) => {
        toast.error(e?.response?.data?.message);
      },
    });
  };

  return (
    <>
      <div className="row g-0">
        <div className="col-lg-5 col-md-6">
          <div className="card-body p-5">
            <div className="text-center">
              <img
                className="mb-3"
                src=""
                alt="logo"
                style={{ height: '48px' }}
              />
              <h1 className="display-5 mb-0">Welcome to CrediSafe</h1>
              <div className="subheading-1 mb-5">
                <strong>{companyName}</strong>, confirm account by inserting
                password below
              </div>
            </div>
            <form className="mb-5" onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="form-label">Username</label>
                <input
                  value={data.username}
                  onChange={changeHandler}
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  value={data.password}
                  onChange={changeHandler}
                  type="password"
                  name="password"
                  id="password"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm Password</label>
                <input
                  value={data.confirmPassword}
                  onChange={changeHandler}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control form-control-sm"
                />
              </div>

              <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                <button
                  className="btn btn-primary mdc-ripple-upgraded"
                  type="submit"
                  disabled={isLoading}
                >
                  {/* {isLoading ? "Loading..." : "Submit"} */}
                  {isLoading ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span className="ml-2">processing..</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
            <div className="text-center"></div>
          </div>
        </div>
        <div
          className="col-lg-7 col-md-6 d-none d-md-block"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/-uHVRvDr7pg/1600x900')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </>
  );
}

ClientCompanyVerify.layout = (page) => (
  <Layout children={page} title={'Account Confirmation'} />
);
