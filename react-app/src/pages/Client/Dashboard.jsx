import Layout from "../../components/Layouts/client/Layout.jsx";
import PieChart from "../../components/PieChart.jsx";
import useClientDashboard from "../../hooks/page-hooks/useClientDashboard.js";
import { formatCurrency } from "../../utils/formatting.js";
import { Link } from "@inertiajs/inertia-react";

export default function Dashboard() {
  const {
    data1,
    data2,
    totalCreditGiven,
    totalCreditTaken,
    worstCreditStatus,
    creditGivenWithPercentages,
    creditTakenWithPercentages,
    navigateToLeases,
  } = useClientDashboard();

  return (
    <main className="container-xl">
      <h5 className="bg-info text-center rounded-3 p-3 text-white mb-5">Dashboard</h5>

      <div className="row row-cols-2 mb-5">
        <div>
          <div className="border shadow-sm bg-white custom-rounded-1 overflow-hidden">
            <div className="bg-info fw-500 text-white p-2 text-center">Payment Status Check</div>

            <div className="d-flex justify-content-around py-3">
              <Link
                href={reverseUrl("cl-search-individuals")}
                className="c-text-link text-decoration-none"
              >
                Individual
              </Link>

              <div>|</div>

              <Link
                href={reverseUrl("cl-search-companies")}
                className="c-text-link text-decoration-none"
              >
                Company
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="border shadow-sm bg-white custom-rounded-1 overflow-hidden">
            <div className="c-bg-light fw-500 p-2 text-center">Your Payment Status</div>

            <table className="table table-sm table-responsive table-bordered m-0">
              <tbody>
                <tr>
                  <td
                    className={`text-white px-4 ${
                      worstCreditStatus.color === "black"
                        ? "bg-black"
                        : worstCreditStatus.color === "orange"
                          ? "bg-warning"
                          : worstCreditStatus.color === "red"
                            ? "bg-danger"
                            : "bg-success"
                    }`}
                  >
                    {worstCreditStatus.score_level === "HHR"
                      ? "High High Risk"
                      : worstCreditStatus.score_level === "LHR"
                        ? "Low High Risk"
                        : worstCreditStatus.score_level === "HLR"
                          ? "High Low Risk"
                          : worstCreditStatus.score_level === "NP"
                            ? "Non Payer"
                            : "Low Low Risk"}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td className="px-4">Oldest Creditor</td>
                  <td>{worstCreditStatus.lease_giver_name}</td>
                  <td>{worstCreditStatus.payment_date}</td>
                  <td className="text-end">
                    {worstCreditStatus.currency}{" "}
                    {worstCreditStatus.balance
                      ? formatCurrency(Number(worstCreditStatus.balance))
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row row-cols-2  mb-5">
        <div>
          <div className="border shadow-sm custom-rounded-1 bg-white overflow-hidden">
            <div className="bg-info fw-500 text-white p-2 text-center">Credit Given</div>

            <table className="table table-sm table-responsive table-bordered m-0">
              <thead>
                <tr>
                  <th className="px-3">Status</th>
                  <th className="px-3 text-end">USD</th>
                  <th className="text-center">%</th>
                </tr>
              </thead>

              <tbody>
                {creditGivenWithPercentages.map((item) => (
                  <tr key={item.label}>
                    <th
                      className="c-pointer  px-3"
                      title="Double click to view all"
                      onDoubleClick={() => navigateToLeases(item.bg)}
                      style={{ backgroundColor: item.bg, color: "white" }}
                    >
                      {item.label}
                    </th>

                    <td
                      className="text-end c-pointer px-3"
                      title="Double click to view all"
                      onDoubleClick={() => navigateToLeases(item.bg)}
                      style={{ backgroundColor: item.bg, color: "white" }}
                    >
                      {formatCurrency(Number(item.amount))}
                    </td>

                    <td className="text-center">{item.percentage || 0}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td className="px-3 fw-500">Total</td>
                  <td className="px-3 fw-500 text-end">
                    {formatCurrency(Number(totalCreditGiven))}
                  </td>
                  <td className="fw-500 text-center">100</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <div className="border shadow-sm custom-rounded-1 bg-white overflow-hidden">
            <div className="bg-danger fw-500 text-white p-2 text-center">Credit Taken</div>

            <table className="table table-sm table-responsive table-bordered m-0">
              <thead>
                <tr>
                  <th className="px-3">Status</th>
                  <th className="px-3 text-end">USD</th>
                  <th className="text-center">%</th>
                </tr>
              </thead>

              <tbody>
                {creditTakenWithPercentages.map((item) => (
                  <tr key={item.label}>
                    <th className="px-3" style={{ backgroundColor: item.bg, color: "white" }}>
                      {item.label}
                    </th>

                    <td className="text-end" style={{ backgroundColor: item.bg, color: "white" }}>
                      {formatCurrency(Number(item.amount))}
                    </td>

                    <td className="text-center">{Number(item.percentage)}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td className="px-3 fw-500">Total</td>
                  <td className="px-3 fw-500 text-end">
                    {formatCurrency(Number(totalCreditTaken))}
                  </td>
                  <td className="fw-500 text-center">100</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="row row-cols-2">
        <div>
          <div className="border shadow-sm bg-white custom-rounded-1 overflow-hidden">
            <div className="c-bg-light fw-500 text-center p-2">Credit Given</div>

            <div className="p-4">
              <PieChart data={data1} />
            </div>
          </div>
        </div>

        <div>
          <div className="border shadow-sm bg-white custom-rounded-1 overflow-hidden">
            <div className="c-bg-light fw-500 text-center p-2">Credit Taken</div>

            <div className="p-4">
              <PieChart data={data2} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

Dashboard.layout = (page) => <Layout children={page} title="Dashboard" />;
