import { capitalize } from 'lodash';
import { Modal } from 'react-bootstrap';

export default function ActiveCustomerLeases({
  show,
  closeModal,
  customerType,
  customers = [],
}) {
  const headerBg =
    customerType === 'individual'
      ? 'bg-info'
      : customerType === 'company'
        ? 'bg-secondary'
        : 'bg-primary';

  const grandTotal = {
    individualLease: customers.reduce(
      (sum, customer) => sum + customer.individualLease,
      0
    ),
    companyLease: customers.reduce(
      (sum, customer) => sum + customer.companyLease,
      0
    ),
    total: customers.reduce((sum, customer) => sum + customer.total, 0),
  };

  return (
    <>
      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Active Leases</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <h5 className={`p-2 m-0 text-white text-center ${headerBg}`}>
              {capitalize(customerType)} Customers
            </h5>

            <table className="table table-sm table-responsive table-bordered">
              <thead>
                <tr>
                  <th>Customer No.</th>
                  <th>Company Name</th>
                  {customerType !== 'company' && <th>Identity No.</th>}
                  <th>Address</th>
                  <th colSpan="2" className="text-center">
                    Lease Type
                  </th>
                  <th>Total</th>
                </tr>

                <tr>
                  <th colSpan={customerType !== 'company' ? 4 : 3}></th>
                  <th className="text-center">Individual</th>
                  <th className="text-center">Company</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={customerType !== 'company' ? 7 : 6}
                      className="text-center text-muted p-5"
                    >
                      Nothing to show
                    </td>
                  </tr>
                )}

                {customers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.customerNo}</td>
                    <td>{customer.companyName}</td>
                    {customerType !== 'company' && (
                      <td>{customer.identityNo}</td>
                    )}
                    <td>{customer.address}</td>
                    <td>{customer.individualLease}</td>
                    <td>{customer.companyLease}</td>
                    <td>{customer.total}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan={customerType !== 'company' ? 4 : 3}>
                    Grand Total
                  </th>
                  <th>{grandTotal.individualLease}</th>
                  <th>{grandTotal.companyLease}</th>
                  <th>{grandTotal.total}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
