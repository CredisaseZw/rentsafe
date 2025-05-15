import { Head } from "@inertiajs/inertia-react";
import CustomToaster from "../CustomToaster.jsx";

export default function BlankLayout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <main>
        <CustomToaster />
        {children}
      </main>
    </>
  );
}
