import Layout from '../../../../components/Layouts/client/Layout.jsx';
import InDevelopment from '../../../../components/InDevelopment.jsx';

export default function SalesInvoicing() {
  return (
    <div>
      <InDevelopment />
    </div>
  );
}

SalesInvoicing.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
