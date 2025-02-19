// import React from 'react'
// import { render } from 'react-dom'
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import axios from 'axios';
import Layout from './components/Layouts/default/Layout.jsx';
import './style.css';
import './custom.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
const pages = import.meta.glob('./pages/**/*.jsx');
// console.log(pages)
document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

  const appName =
    document.getElementsByTagName('title')[0]?.innerText || 'RentSafe';

  InertiaProgress.init({
    // The color of the progress bar...
    color: '#FF0000',
    showSpinner: true,
  });

  createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: async (name) => {
      const page = (await pages[`./pages/${name}.jsx`]()).default;
      page.layout = page.layout || Layout;
      return page;
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    },
  });
});
