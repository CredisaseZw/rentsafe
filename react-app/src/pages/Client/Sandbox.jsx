import Layout from "../../components/Layouts/client/Layout.jsx";

export default function Sandbox() {
  // for testing purposes, test components or features in isolation
  return <div></div>;
}

Sandbox.layout = (page) => <Layout children={page} title="Sandbox" />;
