import Layout from '../../../../components/Layouts/client/Layout.jsx';
import InDevelopment from '../../../../components/InDevelopment.jsx';

export default function SalesAccounts() {
  return (
    <div>
      <InDevelopment />
    </div>
  );
}

SalesAccounts.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
