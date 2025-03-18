import { usePage } from "@inertiajs/inertia-react";
import toast from "react-hot-toast";
import PageHeader from "../../../components/PageHeader.jsx";
import { formatCurrency } from "../../../utils/formatting.js";
import BottomDrawer from "../../../components/Drawer.jsx";
import { DrawerContent } from "../../../components/DrawerContent.jsx";

const Index = () => {
  const leases = usePage().props.leases;
  const subscriptions = usePage().props.subscriptions;
  const error = usePage().props.error;
  if (error) toast.error(error);
  return (
    <main className="mb-5 position-relative " style={{ minHeight: "100vh" }}>
      <PageHeader title={"Leases"} />
      <div className="container-xl p-5">
        <div className="card card-raised mb-5">
          <div className="card-header px-4" style={{ height: "50px", backgroundColor: "#32a4a8" }}>
            <div className="d-flex justify-content-center align-items-center">
              <div className="">
                <h2 className="display-6 tf-color">Lease Management</h2>
              </div>
            </div>
          </div>
          <div
            className="card-body p-4  position-relative"
            style={{
              overflowX: "hidden",
            }}
          >
            {/* Active lease */}
            <div className="" style={{ backgroundColor: "#428f38" }}>
              <h5 className="text-center tf-color">Active Lease</h5>
            </div>
            <div
              style={{
                maxHeight: "550px",
                width: "100%",
                overflowY: "auto",
                marginTop: "45px",
              }}
              className="table-responsive"
            >
              <table
                className="table table-responsive position-absolute "
                style={{
                  top: "47px",
                }}
              >
                <thead>
                  <tr style={{ borderTop: "0px" }}>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      No.
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Tenant
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Address
                    </th>
                    <th scope="col" className="text-center">
                      Rent Owing
                    </th>
                  </tr>
                </thead>
              </table>
              <table className="table table-bordered table-responsive ">
                <tbody style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {leases?.map((lease, index) => (
                    <tr key={"lease" + index}>
                      <th scope="row">{index + 1}</th>
                      <td>{lease.name}</td>
                      <td>{lease.address}</td>
                      <td className={`bg-${lease.color} text-white text-end`}>
                        {lease.currency}
                        {formatCurrency(lease.monthly_rentals)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Available subscription */}
          </div>
        </div>
      </div>
      <div
        className="w-100"
        style={{
          backgroundColor: "#e3d329",
          position: "absolute",
          bottom: "80px",
          right: "0",
          width: "100%",
        }}
      >
        <BottomDrawer
          trigger={
            <div style={{ backgroundColor: "#e3d329" }}>
              <h5 className="text-center tf-color py-2">Available Subscriptions</h5>
            </div>
          }
        >
          <DrawerContent title={"Available Subscriptions"}>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr style={{ borderTop: "0px" }}>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      No.
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Type
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Open Slots
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Period (months)
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      Start Date
                    </th>
                    <th scope="col" style={{ borderTop: "1px solid #e0e0e0" }}>
                      End Date
                    </th>
                    <th scope="col" colSpan="2" className="tf-borderRight"></th>
                    {/* <th scope="col" className='tf-borderRight'></th>
<th scope="col" className='tf-borderRight'></th> */}
                  </tr>
                </thead>
                <tbody>
                  {subscriptions?.map((subscription, index) => (
                    <>
                      {subscription.open_slots > 0 && (
                        <tr key={"subscription" + index}>
                          <th scope="row">{index + 1}</th>
                          <td>{subscription.subscription_class}</td>
                          <td>{subscription.open_slots}</td>
                          <td>{subscription.period_length}</td>
                          <td>{subscription.start_date}</td>
                          <td>{subscription.end_date}</td>
                          <td
                            colSpan="2"
                            className={`${
                              subscription.open_slots === 0 ? "bg-gray" : "bg-success"
                            } text-white text-center tfRow`}
                            // onClick={() => {
                            //   if (subscription.open_slots !== 0) {
                            //     setBtnAdd(true);
                            //     setEditBtn(false);
                            //     setDetails({});
                            //     setSubscription({
                            //       type: subscription.subscription_class,
                            //     });
                            //     setVerificationType(
                            //       subscription.subscription_class
                            //     );
                            //     setSubLength(subscription.period_length);
                            //   }
                            // }}
                          >
                            Activate
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </DrawerContent>
        </BottomDrawer>
      </div>
    </main>
  );
};

export default Index;
