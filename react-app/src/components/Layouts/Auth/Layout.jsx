import CustomToaster from "../../CustomToaster.jsx";
import { Head } from "@inertiajs/inertia-react";

export default function Layout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <CustomToaster />

      <div
        style={{ minHeight: "100vh", backgroundColor: "rgb(230, 230, 230)" }}
        className="d-flex align-items-center justify-content-center "
      >
        <div className="custom-mn-w-5 c-w-fit shadow-lg bg-white custom-rounded-2">{children}</div>
      </div>
    </>
  );
}
