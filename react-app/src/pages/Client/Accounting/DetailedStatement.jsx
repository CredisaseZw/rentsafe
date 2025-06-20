import Layout from "../../../components/Layouts/client/Layout.jsx";
import Receipt from "../../../components/features/leases/Receipt.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import PeriodRequest from "../../../components/Client/PeriodRequest.jsx";
import useDetailedStatement from "../../../hooks/page-hooks/useDetailedStatement.js";
import { formatCurrency } from "../../../utils/formatting.js";
import { friendlyDate } from "../../../utils/index.js";

export default function DetailedStatement({ message }) {
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

  if (!statement) return <h1>{message}</h1>;

  return (
    <div>
      <>
        <PeriodRequest
          show={show}
          handleClose={handleClose}
          tenantData={{
            tenantNumber: tenant.lease_receiver_id,
            name: tenant.lease_receiver_name,
            adress: tenant.lease_receiver_address,
          }}
        />

        {showReceipt && (
          <Receipt
            show={showReceipt}
            handleClose={async (message) => {
              setShowReceipt(false);
              setDetails({});
            }}
            leaseDetails={details}
            myKey={"statements"}
          />
        )}
      </>

      <div ref={modalContentRef}>
        <CustomTable.Table
          tabletitleOverideContent={
            <div className="d-flex text-start justify-content-between align-items-center p-3">
              <div>
                <h4 className="text-white mb-1 fw-bold">
                  {tenant.lease_receiver_name} - {tenant?.currency}
                </h4>

                <div>{tenant.lease_receiver_address} </div>
              </div>

              <div>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          }
          tabletitleBg="info"
          tabletitleColor="white"
          size="lg"
        >
          <CustomTable.ColGroup ratios={[1, null, 1, 1, 1]} />

          <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
            <tr className="c-thead-bg">
              <th>Date</th>
              <td>Description</td>
              <td>Ref</td>
              <td>Amount</td>
              <td>Balance</td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="text-nowrap">{friendlyDate(statement.date)}</td>
              <td>{statement.description}</td>
              <td />
              <td />
              <td className="text-end">{formatCurrency(statement.balance_amount)}</td>
            </tr>

            {cleanedData.map((payment, index) => (
              <tr key={index}>
                <td className="text-nowrap">{friendlyDate(payment.date)}</td>
                <td>{payment.description}</td>
                <td className="text-nowrap">{payment.reference}</td>
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
        </CustomTable.Table>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-3 p-4">
        <CustomTable.ActionButtonTemplate
          size="lg"
          variant="secondary"
          onClick={() => {
            setShowReceipt(true);
            setDetails({ lease_id: tenant.lease_id });
          }}
        >
          Receipt
        </CustomTable.ActionButtonTemplate>

        <CustomTable.ActionButtonTemplate size="lg" variant="primary" onClick={() => setShow(true)}>
          Period request
        </CustomTable.ActionButtonTemplate>

        <CustomTable.ActionButtonTemplate size="lg" onClick={handlePrintToPdf}>
          Print
        </CustomTable.ActionButtonTemplate>
      </div>
    </div>
  );
}

DetailedStatement.layout = (page) => <Layout children={page} title={"Detailed Tenant Statement"} />;
