import Layout from '../../../../components/Layouts/client/Layout.jsx';
import InDevelopment from '../../../../components/InDevelopment.jsx';

export default function CashSales() {
  return (
    <div>
      <InDevelopment />
    </div>
  );
}

CashSales.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
