import Layout from "../../../components/Layouts/client/Layout.jsx";
import IndividualSearch from "../../../components/Client/IndividualSearch.jsx";

export default function SearchIndividual({ individuals }) {
  return <IndividualSearch individuals={individuals} url={"cl-search-individuals"} />;
}

SearchIndividual.layout = (page) => <Layout children={page} />;
