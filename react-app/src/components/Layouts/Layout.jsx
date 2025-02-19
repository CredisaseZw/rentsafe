import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import toast, { Toaster } from 'react-hot-toast';

const Layout = ({ children, title }) => {
  const { error } = usePage().props;

  if (error) {
    // console.log(error.type)
    error.type && toast[error.type](error.message);
  }
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: '100vh' }}
    >
      <Head title={title} />
      <main>
        <div className="container">
          <div className="row  h-100 justify-content-center">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
