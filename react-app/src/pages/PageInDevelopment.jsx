import InDevelopment from "../components/InDevelopment.jsx";
import Layout from "../components/Layouts/client/Layout.jsx";

export default function PageInDevelopment() {
  return <InDevelopment />;
}

PageInDevelopment.layout = (page) => <Layout children={page} title="In development" />;
