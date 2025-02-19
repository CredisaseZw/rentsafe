import React from 'react';
import { Head } from '@inertiajs/inertia-react';
// import Search from '../../../components/features/users/companies/Search.jsx';

// import Search from '../../../components/features/users/individuals/Search.jsx';
import IndividualSearch from '../../../components/Admin/IndividualSearch.jsx';
export default function SearchIndividual({individuals}) {
  
  return (
    <>
      <Head title={'Search individual'} />
      <IndividualSearch individuals={individuals} url={'individuals'}/>
      
    </>
  );
}

