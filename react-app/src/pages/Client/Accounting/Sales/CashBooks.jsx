import Layout from '../../../../components/Layouts/client/Layout.jsx';
import InDevelopment from '../../../../components/InDevelopment.jsx';

export default function CashBooks() {
  return (
    <div>
      <InDevelopment />
    </div>
  );
}

CashBooks.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
