import moment from 'moment';
import Layout from '../../../components/Layouts/client/Layout.jsx';
import Receipt from '../../../components/features/leases/Receipt.jsx';
import PeriodRequest from '../../../components/Client/PeriodRequest.jsx';
import useDetailedStatement from '../../../hooks/page-hooks/useDetailedStatement.js';
import { formatCurrency } from '../../../utils/formatting.js';
import { usePage } from '@inertiajs/inertia-react';

export default function DetailedStatement() {
  const {
    show,
    tenant,
    details,
    statement,
    showReceipt,
    cleanedData,
    modalContentRef,
    setShow,
    setDetails,
    handleClose,
    setShowReceipt,
    handlePrintToPdf,
  } = useDetailedStatement();

  if (!statement) {
    return (
      <div>
        <h1>{usePage().props.message}</h1>
      </div>
    );
  }

  return (
    <div>
      <PeriodRequest
        show={show}
        handleClose={handleClose}
        tenantData={{
          tenantNumber: tenant.lease_receiver_id,
          name: tenant.lease_receiver_name,
          adress: tenant.lease_receiver_address,
        }}
      />

      <div ref={modalContentRef}>
        <div
          style={{
            lineHeight: '5px',
            fontSize: '18px',
          }}
          className="bg-info"
        >
          <div
            scope="row"
            colSpan={5}
            className="d-flex justify-content-between align-items-center text-white p-3"
            style={{ width: '100%' }}
          >
            <div className="d-flex flex-column gap-2">
              <h4 className="fw-bold text-white">
                {tenant.lease_receiver_name} - {tenant?.currency}
              </h4>
              <p>{tenant.lease_receiver_address} </p>
            </div>
            <p>
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <table className="table table-bordered">
          <thead className="position-sticky c-table-top">
            <tr
              style={{
                lineHeight: '5px',
                fontSize: '12px',
                backgroundColor: '#a0a0af',
              }}
            >
              <th scope="">Date</th>
              <td>Description</td>
              <td> Ref</td>
              <td>Amount</td>
              <td>Balance</td>
            </tr>
          </thead>

          <tbody>
            <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
              <th scope="row">{statement.date}</th>
              <td>{statement.description}</td>
              <td></td>
              <td className="text-end"></td>
              <td className="text-end">
                {formatCurrency(statement.balance_amount)}
              </td>
            </tr>

            {cleanedData.map((payment, index) => (
              <tr style={{ lineHeight: '5px', fontSize: '12px' }} key={index}>
                <th scope="row">{moment(payment.date).format('YYYY-MM-DD')}</th>
                <td>{payment.description} </td>
                <td>{payment.reference}</td>
                <td className="text-end">
                  {payment.owing_amount < 0
                    ? `(${formatCurrency(payment.owing_amount * -1)})`
                    : formatCurrency(payment.owing_amount)}
                </td>
                <td className="text-end">
                  {payment.balance_amount < 0
                    ? `(${formatCurrency(payment.balance_amount * -1)})`
                    : formatCurrency(payment.balance_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-4 p-4">
        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowReceipt(true);
            setDetails({
              lease_id: tenant.lease_id,
            });
          }}
        >
          Receipt
        </button>
        <button className="btn btn-primary" onClick={() => setShow(true)}>
          Period request
        </button>
        <button className="btn btn-info text-white" onClick={handlePrintToPdf}>
          Print
        </button>
      </div>

      {/* {showReceipt && ( */}
      <Receipt
        show={showReceipt}
        handleClose={async (message) => {
          setShowReceipt(false);
          setDetails({});
        }}
        leaseDetails={details}
        myKey={'statements'}
      />
      {/* )} */}
    </div>
  );
}

DetailedStatement.layout = (page) => (
  <Layout children={page} title={'Tenant Detailed Statement'} />
);
