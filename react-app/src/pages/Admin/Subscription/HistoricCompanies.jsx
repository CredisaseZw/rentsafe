import { usePage } from '@inertiajs/inertia-react';
import React from 'react';
import PageHeader from '../../../components/PageHeader.jsx';

export default function HistoricCompanies() {
  const { company_list: subscriptions } = usePage().props;
  return (
    <main>
      <PageHeader title={'Historic Subscriptions'} />
      <div className="container-xl p-5">
        <div className="card card-raised mb-5">
          <div className="card-header px-4 bg-info" style={{ height: '50px' }}>
            <div className="d-flex justify-content-center align-items-center">
              <div className="">
                <h2 className="display-6 text-white">Companies</h2>
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
                      Reg No.
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Contact No.
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Sub Name
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      Sub ID/Reg No.
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
                      Start Date
                    </th>
                    <th scope="col" style={{ borderTop: '1px solid #e0e0e0' }}>
                      End Date
                    </th>
                    <th scope="col" className="tf-borderRight"></th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions?.map(
                    ({
                      subscription_id: id,
                      subscriber: subscriberName,
                      service: product,
                      subscription_class: subClass,
                      subscription_period: period,
                      subscriber_reg_number: id_number,
                      subscriber_profile_number: contact_number,
                      subscription_receiver_reg_number: sub_id,
                      subscription_receiver: sub_name,
                      subscription_start_date: startDate,
                      subscription_end_date: endDate,
                    }) => {
                      return (
                        <tr key={id} style={{ fontSize: '12px' }}>
                          <th scope="row">{id}</th>
                          <td>{subscriberName}</td>
                          <td>{id_number}</td>
                          <td>{contact_number}</td>
                          <td>{sub_name}</td>
                          <td>{sub_id}</td>
                          <td>{product}</td>
                          <td>{`${subClass === 'company' ? 'C' : 'I'}`}</td>
                          <td>{period}</td>
                          <td>{startDate}</td>
                          <td>{endDate}</td>
                          <td className="bg-success text-white text-center tfRow">
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
      </div>
    </main>
  );
}
