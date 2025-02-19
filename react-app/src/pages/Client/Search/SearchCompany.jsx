import Layout from '../../../components/Layouts/client/Layout.jsx';
import CompanySearch from '../../../components/Client/CompanySearch.jsx';

export default function SearchCompany() {
  return <CompanySearch url={'cl-search-companies'} />;
}

SearchCompany.layout = (page) => <Layout children={page} />;
