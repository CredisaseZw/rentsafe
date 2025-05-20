import { Head } from "@inertiajs/inertia-react";
import CustomToaster from "../CustomToaster.jsx";

export default function BlankLayout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="CrediSafe is a fintech company that provides credit scoring and financial solutions tailored to the African market."
        />
        <meta
          name="keywords"
          content="CrediSafe, fintech, credit scoring, financial solutions, Africa"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <CustomToaster />
        {children}
      </main>
    </>
  );
}
