import Layout from '../../../../components/Layouts/client/Layout.jsx';
import InDevelopment from '../../../../components/InDevelopment.jsx';

export default function GeneralLedger() {
  return (
    <div>
      <InDevelopment />
    </div>
  );
}

GeneralLedger.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
