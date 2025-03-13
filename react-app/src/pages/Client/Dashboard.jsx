import Layout from '../../components/Layouts/client/Layout.jsx';
import PieChart from '../../components/PieChart.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import useClientDashboard from '../../hooks/page-hooks/useClientDashboard.js';
import { formatCurrency } from '../../utils/formatting.js';
import { Link } from '@inertiajs/inertia-react';

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
    <main>
      <PageHeader title={'Dashboard'} />
      <div className="container-xl p-5">
        <div className="row align-items-start justify-content-center gap-4 gap-md-0  mb-5">
          <div className="col-md-6">
            <div className="card card-raised  overflow-hidden">
              <div className="card-header bg-info text-white px-4">
                <div className="fw-500 text-center">Payment Status Check</div>
              </div>
              <div className="card-body p-0">
                <div className="d-flex justify-content-around mt-2 mb-2">
                  <div>
                    <Link
                      href={reverseUrl('cl-search-individuals')}
                      style={{ color: '#176987', textDecoration: 'none' }}
                    >
                      Individual
                    </Link>
                  </div>
                  <div>|</div>
                  <div>
                    <Link
                      href={reverseUrl('cl-search-companies')}
                      style={{ color: '#176987', textDecoration: 'none' }}
                    >
                      Company
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card-raised  overflow-hidden">
              <div className="card-header px-4 bg-gray">
                <div className="fw-500 text-center">Your Payment Status</div>
              </div>
              <div className="card-body p-0">
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                      }}
                    >
                      <th
                        scope=""
                        className={`text-white px-4 ${
                          worstCreditStatus.color === 'black'
                            ? 'bg-black'
                            : worstCreditStatus.color === 'orange'
                              ? 'bg-warning'
                              : worstCreditStatus.color === 'red'
                                ? 'bg-danger'
                                : 'bg-success'
                        }`}
                      >
                        {worstCreditStatus.score_level === 'HHR'
                          ? 'High High Risk'
                          : worstCreditStatus.score_level === 'LHR'
                            ? 'Low High Risk'
                            : worstCreditStatus.score_level === 'HLR'
                              ? 'High Low Risk'
                              : worstCreditStatus.score_level === 'NP'
                                ? 'Non Payer'
                                : 'Low Low Risk'}
                      </th>
                      {/* <td colSpan={2}>Score {worstCreditStatus.score_range}</td> */}
                    </tr>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                      }}
                    >
                      <th scope="">Oldest Creditor</th>
                      <td>{worstCreditStatus.lease_giver_name}</td>
                      <td>{worstCreditStatus.payment_date}</td>
                      <td className="text-end">
                        {worstCreditStatus.currency}{' '}
                        {worstCreditStatus.balance
                          ? formatCurrency(Number(worstCreditStatus.balance))
                          : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-start gap-4 gap-md-0 mb-5">
          <div className="col-md-6">
            <div className="card card-raised  overflow-hidden">
              <div className="card-header bg-info text-white px-4 py-1">
                <div className="fw-500 text-center">Credit Given</div>
              </div>
              <div className="card-body py-1">
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                      }}
                    >
                      <th scope="">Status</th>
                      <td>USD</td>
                      <td> %</td>
                    </tr>

                    {creditGivenWithPercentages.map((item) => (
                      <tr
                        key={item.label}
                        style={{ lineHeight: '5px', fontSize: '12px' }}
                      >
                        <th
                          className="c-pointer"
                          onDoubleClick={() => navigateToLeases(item.bg)}
                          title="Double click to view all"
                          scope=""
                          style={{ backgroundColor: item.bg, color: 'white' }}
                        >
                          {item.label}
                        </th>

                        <td
                          style={{ backgroundColor: item.bg, color: 'white' }}
                          className="text-end c-pointer"
                          onDoubleClick={() => navigateToLeases(item.bg)}
                          title="Double click to view all"
                        >
                          {formatCurrency(Number(item.amount))}
                        </td>

                        <td>{item.percentage || 0}</td>
                      </tr>
                    ))}

                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      <th scope="row" className="">
                        Total
                      </th>
                      <td className="text-end">
                        {formatCurrency(Number(totalCreditGiven))}
                      </td>
                      <td>100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card-raised  overflow-hidden">
              <div className="card-header bg-danger text-white px-4 py-1">
                <div className="fw-500 text-center">Credit Taken</div>
              </div>
              <div className="card-body py-1">
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                      }}
                    >
                      <th scope="">Status</th>
                      <td>USD</td>
                      <td> %</td>
                    </tr>
                    {creditTakenWithPercentages.map((item) => (
                      <tr
                        key={item.label}
                        style={{ lineHeight: '5px', fontSize: '12px' }}
                      >
                        <th
                          scope=""
                          style={{ backgroundColor: item.bg, color: 'white' }}
                        >
                          {item.label}
                        </th>
                        <td
                          style={{ backgroundColor: item.bg, color: 'white' }}
                          className="text-end"
                        >
                          {formatCurrency(Number(item.amount))}
                        </td>
                        <td>{Number(item.percentage)}</td>
                      </tr>
                    ))}
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      <th scope="row" className="">
                        Total
                      </th>
                      <td className="text-end">
                        {formatCurrency(Number(totalCreditTaken))}
                      </td>
                      <td>100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-start gap-4 gap-md-0 mb-5">
          <div className="col-md-6">
            <div className="card card-raised overflow-hidden">
              <div className="card-header py-1">
                <div className="fw-500 text-center">Credit Given</div>
              </div>
              <div className="card-body p-4">
                <PieChart data={data1} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card-raised overflow-hidden">
              <div className="card-header py-1">
                <div className="fw-500 text-center">Credit Taken</div>
              </div>
              <div className="card-body p-4">
                <PieChart data={data2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

Dashboard.layout = (page) => <Layout children={page} title="Dashboard" />;
