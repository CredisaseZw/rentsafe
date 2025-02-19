import { useForm, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layouts/Auth/Layout.jsx';

export default function Login({ errors }) {
  const [flashed, setFlashed] = useState(false);
  const flash = usePage().props.flash;
  if (flash.type === 'success' && !flashed) {
    toast.success(flash.message);
    setFlashed(true);
  }
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, post } = useForm({
    email: '',
    password: '',
  });
  const changeHandler = (e) =>
    setData({ ...data, [e.target.id]: e.target.value });

  const forgotPasswordHandler = (e) => {
    e.preventDefault();
    if (data.email !== '') {
      post(reverseUrl('forgot_password'), {
        onStart: () => {
          setIsLoading(true);
        },
        onSuccess: (response) => {
          if (response.props.success) {
            toast.success(response.props.success.message);
          }
          setIsLoading(false);
        },
        onError: (e) => {
          setIsLoading(false);
        },
      });
    } else {
      toast.error('Enter your email');
    }
  };

  const submitHandler = (e) => {
    console.log('clicked');
    e.preventDefault();
    post(reverseUrl('login'), {
      onStart: () => {
        console.log('starting...');
        setIsLoading(true);
      },
      onSuccess: (response) => {
        console.log(response.message);
        setIsLoading(false);
      },
      onError: (e) => {
        console.log(e.errors);
      },
    });
  };

  return (
    <>
      <div className="row g-0">
        <div className="col-lg-5 col-md-6 col-12">
          <div className="card-body p-5 w-100">
            <div className="text-center">
              <img
                className="mb-3"
                src=""
                alt="logo"
                style={{ height: '48px' }}
              />
              <h1 className="display-5 mb-0">Login</h1>
              <div className="subheading-1 mb-5">to continue to app</div>
            </div>
            <form className="mb-5 w-100 " onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input
                  value={data.email}
                  onChange={changeHandler}
                  type="text"
                  name="email"
                  id="email"
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

              <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                <button
                  onClick={forgotPasswordHandler}
                  className="btn btn-link"
                  type="button"
                >
                  Forgot Password?
                </button>
                <button
                  className="btn btn-primary mdc-ripple-upgraded"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span className="ml-2">processing..</span>
                    </>
                  ) : (
                    'Login'
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

Login.layout = (page) => <Layout children={page} title={'Login'} />;
