import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import React from 'react';

export default function ActiveSub() {
  const { subscriptions, activeSubscriptions } = usePage().props;
  return (
    <div className="card card-raised mb-5">
      <div className="card-header px-4 bg-info" style={{ height: '50px' }}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="">
            <h2 className="display-6 text-white">
              Active Subscriptions {activeSubscriptions}
            </h2>
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr style={{ borderTop: '0px', fontSize: '12px' }}>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Trans No.
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Subscriber Name
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Product
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Sub Class
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Sub Period
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  No. of Subs
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Start Date
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  End Date
                </th>
                <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                  Months Remaining
                </th>
                <th scope="col" className="tf-borderRight"></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions?.map(
                (
                  {
                    id,
                    subscriptionName,
                    product,
                    subClass,
                    period,
                    number_of_subscriptions,
                    startDate,
                    endDate,
                    monthsRemains,
                  },
                  index
                ) => {
                  return (
                    <tr key={index + id} style={{ fontSize: '12px' }}>
                      <th scope="row">{id}</th>
                      <td>{subscriptionName}</td>
                      <td>{product}</td>
                      <td>{subClass}</td>
                      <td>{period}</td>
                      <td>{number_of_subscriptions}</td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td>{monthsRemains}</td>
                      <td
                        className="bg-success text-white text-center tfRow"
                        onClick={() =>
                          (window.location.href = `view-subscriptions/${id}/`)
                        }
                      >
                        View
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
