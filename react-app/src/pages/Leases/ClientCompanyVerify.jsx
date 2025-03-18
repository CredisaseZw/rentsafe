import { usePage } from "@inertiajs/inertia-react";
import Lottie from "react-lottie";
import error from "../../assets/error_.json";
import done from "../../assets/done.json";
import Layout from "../../components/Layouts/Layout.jsx";

const ClientCompanyVerify = () => {
  const { is_verified } = usePage().props;
  return (
    <div className="d-flex justify-content-center align-items-center h-75 w-100 gap-3 flex-column text-center p-4">
      {is_verified ? (
        <>
          <div
            className="d-flex justify-content-center align-items-center column text-center p-4"
            style={{ maxHeight: "200px" }}
          >
            <Lottie
              animationData={done}
              allowFullScreen
              placeholder="done"
              className="w-25 h-25"
              options={{
                loop: false,
                autoplay: true,
                animationData: done,
                rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                height: 100,
                width: 100,
              }}
            />
          </div>
          <p className="h3">Your lease has been verified.</p>
        </>
      ) : (
        <>
          <div
            className="d-flex justify-content-center align-items-center column text-center p-4"
            style={{ maxHeight: "200px" }}
          >
            <Lottie
              animationData={error}
              allowFullscreen
              className="w-50 h-50"
              options={{
                loop: false,
                autoplay: true,
                animationData: done,
                rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                height: 200,
                width: 200,
              }}
            />
          </div>
          <p className="h3">Lease verification failed!</p>
        </>
      )}
    </div>
  );
};

ClientCompanyVerify.layout = (page) => <Layout children={page} title={"Lease Confirmation"} />;

export default ClientCompanyVerify;
