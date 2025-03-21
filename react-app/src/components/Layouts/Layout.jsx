import React from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import toast from "react-hot-toast";
import CustomToaster from "../CustomToaster.jsx";

const Layout = ({ children, title }) => {
  const { error } = usePage().props;

  if (error) {
    // console.log(error.type)
    error.type && toast[error.type](error.message);
  }
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <Head title={title} />
      <main>
        <div className="container">
          <div className="row  h-100 justify-content-center">
            <CustomToaster />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
