import React from "react";
import Layout from "../../components/Layouts/Auth/Layout.jsx";
import useLogin from "../../hooks/page-hooks/useLogin.jsx";

export default function Login({ flash, error }) {
  const { data, isLoading, submitHandler, changeHandler, forgotPasswordHandler } = useLogin(
    flash,
    error
  );

  return (
    <>
      <div className="d-md-none p-5 text-center ">
        <div>Please view on desktop</div>
      </div>

      <form className="p-5 my-5 d-none d-md-block" onSubmit={submitHandler}>
        <div className="text-center">
          <i className="material-icons fs-1">person</i>
          <h1 className="display-5 mb-0 mt-2">CrediSafe</h1>
          <div className="subheading-1 mb-4">Login to continue</div>
        </div>

        <div className="px-5">
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              value={data.email}
              onChange={changeHandler}
              type="text"
              name="email"
              id="email"
              className="form-control"
              required
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
              className="form-control"
              required
            />
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn shadow-none btn-link px-0 text-capitalize"
              onClick={forgotPasswordHandler}
            >
              Forgot Password?
            </button>

            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="ms-2">processing..</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

Login.layout = (page) => <Layout children={page} title={"Login"} />;
