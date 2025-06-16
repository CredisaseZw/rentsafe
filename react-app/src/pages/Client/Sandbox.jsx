import Layout from "../../components/Layouts/client/Layout.jsx";

export default function Sandbox() {
  return <div>Sandbox</div>;
}

Sandbox.layout = (page) => <Layout children={page} title="Sandbox" />;
