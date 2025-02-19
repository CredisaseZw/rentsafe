import PageHeader from '../../components/PageHeader.jsx';
import WeeklyImpactTable from '../../components/Admin/WeeklyImpactTable.jsx';
import MonthlyImpactTable from '../../components/Admin/MonthlyImpactTable.jsx';
import ActiveCustomerLeases from '../../components/Admin/dashboard/ActiveCustomerLeases.jsx';
import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Head, Link } from '@inertiajs/inertia-react';
import {
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  BarElement,
  Legend,
  Title,
  Chart,
  Tooltip,
} from 'chart.js';

export default function Dashboard({
  individual_customers = [],
  company_customers = [],
}) {
  const [activeLeaseTab, setActiveLeaseTab] = useState(undefined);

  const individualCustomers = individual_customers.map((customer, index) => ({
    customerNo: `I-${index + 1}`,
    companyName: customer.subscriber_name,
    identityNo: customer.subscriber_id,
    address: customer.subscriber_address,
    individualLease: customer.individual_leases_count || 0,
    companyLease: customer.company_leases_count || 0,
    total:
      (customer.individual_leases_count || 0) +
      (customer.company_leases_count || 0),
  }));

  const companyCustomers = company_customers.map((customer, index) => ({
    customerNo: `C-${index + 1}`,
    companyName: customer.subscriber_name,
    address: customer.subscriber_address,
    individualLease: customer.individual_leases_count || 0,
    companyLease: customer.company_leases_count || 0,
    total:
      (customer.individual_leases_count || 0) +
      (customer.company_leases_count || 0),
  }));

  console.log(individualCustomers, companyCustomers);

  return (
    <>
      <>
        <Head title="Admin Dashboard" />

        {!!activeLeaseTab && (
          <ActiveCustomerLeases
            show={!!activeLeaseTab}
            customerType={activeLeaseTab}
            customers={
              activeLeaseTab === 'individual'
                ? individualCustomers
                : activeLeaseTab === 'company'
                  ? companyCustomers
                  : [...individualCustomers, ...companyCustomers]
            }
            closeModal={() => setActiveLeaseTab(undefined)}
          />
        )}
      </>

      <main>
        <PageHeader title={'Dashboard'} />

        <div className="container-xl p-4">
          <div className="row align-items-center mb-4">
            <div className="col-6">
              <div className="border shadow-sm bg-white">
                <h5 className="m-0 p-2 bg-info text-white text-center">
                  Credit Status Check
                </h5>

                <div className="d-flex justify-content-around p-2">
                  <Link
                    href={reverseUrl('individuals')}
                    className="c-text-link text-decoration-none"
                  >
                    Individual
                  </Link>

                  <div>|</div>

                  <div>
                    <Link
                      href={reverseUrl('companies')}
                      className="c-text-link text-decoration-none"
                    >
                      Company
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="border shadow-sm bg-white">
                <h5 className="m-0 p-2 bg-info text-white text-center">
                  View Active Leases
                </h5>

                <div className="d-flex justify-content-around p-2 gap-3">
                  <button
                    className="btn btn-sm py-2 btn-info text-white  flex-fill justify-content-center"
                    onClick={() => setActiveLeaseTab('individual')}
                  >
                    Individual
                  </button>
                  <button
                    className="btn btn-sm py-2 btn-secondary  flex-fill justify-content-center"
                    onClick={() => setActiveLeaseTab('company')}
                  >
                    Company
                  </button>
                  <button
                    className="btn btn-sm py-2 btn-primary  flex-fill justify-content-center"
                    onClick={() => setActiveLeaseTab('combined')}
                  >
                    Combined
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center mb-4">
            <div className="col-6">
              <div className="d-flex flex-column bg-white">
                <Line
                  data={LineChatData}
                  options={{
                    animation: false,
                    maintainAspectRatio: false,
                    elements: { line: { tension: 0.4 } },
                    datalabels: {
                      color: 'white',
                      font: {
                        weight: 'bold',
                        size: 14,
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: true },
                        offset: true,
                        title: {
                          display: true,
                          text: 'Week End',
                          align: 'center',
                          font: {
                            size: 20,
                            weight: 'medium',
                          },
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          align: 'center',
                          text: 'Active Leases',
                          font: {
                            size: 20,
                            weight: 'medium',
                          },
                        },
                        grid: { display: true },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="col-6">
              <div className="d-flex flex-column bg-white">
                <Bar
                  data={barChatData}
                  options={{
                    animation: false,
                    maintainAspectRatio: false,
                    elements: { line: { tension: 0.4 } },

                    datalabels: {
                      color: 'white',
                      font: {
                        weight: 'bold',
                        size: 14,
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: true },
                        offset: true,
                        title: {
                          display: true,
                          text: 'Month End',
                          align: 'center',
                          font: {
                            size: 20,
                            weight: 'medium',
                          },
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          align: 'center',
                          text: 'Active Leases',
                          font: {
                            size: 20,
                            weight: 'medium',
                          },
                        },
                        grid: { display: true },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row align-items-start justify-content-between mb-4">
            <div className="col-6">
              <div className="bg-white">
                <WeeklyImpactTable />
              </div>
            </div>

            <div className="col-6">
              <div className="bg-white">
                <MonthlyImpactTable />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  TimeScale,
  Legend,
  Tooltip
);

const LineChatData = {
  labels: [
    '25-Feb',
    '3-Mar',
    '10-Mar',
    '17-Mar',
    '24-Mar',
    '31-Mar',
    '7-Apr',
    '14-Apr',
    '21-Apr',
    '28-Apr',
    '5-May',
    '12-May',
  ],
  datasets: [
    {
      label: 'Leases - 2024',
      data: [10, 14, 19, 25, 31, 40, 52, 60, 75, 80, 93, 100],
      fill: true,
      backgroundColor: '#53D9D9',
      borderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#0e0d0d',
    },
  ],
};

const barChatData = {
  labels: [
    'Jan-24',
    'Feb-24',
    'Mar-24',
    'Apr-24',
    'May-24',
    'Jun-24',
    'Jul-24',
  ],
  datasets: [
    {
      label: 'Leases - 2024',
      data: [33, 36, 40, 41, 44, 65, 76],
      fill: true,
      backgroundColor: '#53D9D9',
      borderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#0e0d0d',
    },
  ],
};
