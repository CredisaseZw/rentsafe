import React from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import toast from 'react-hot-toast';
import CustomToaster from '../../CustomToaster.jsx';

const Layout = ({ children, title }) => {
  const { error } = usePage().props;

  if (error) {
    // console.log(error.type)
    error.type && toast[error.type](error.message);
  }
  return (
    <div className="bg-pattern-waihou">
      <Head title={title} />
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xxl-10 col-xl-10 col-lg-12">
                  <div className="card card-raised shadow-10 mt-5 mt-xl-10 mb-4">
                    <CustomToaster />

                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div id="layoutAuthentication_footer"></div>
      </div>
    </div>
  );
};

export default Layout;
