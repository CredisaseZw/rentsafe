import React from 'react';
import { Head } from '@inertiajs/inertia-react';

// import Search from '../../components/features/users/companies/Search.jsx';
import CompanySearch from '../../../components/Admin/CompanySearch.jsx';
export default function SearchCompany() {
  return (
    <>
      <Head title={'Search company'} />
      <CompanySearch url={'companies'}/>
    </>
  );
}
