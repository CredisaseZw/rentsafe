import { friendlyDate } from '../../../utils/index.js';
import SectionSkeleton from './SectionSkeleton.jsx';

export default function PaymentPlans({ paymentPlans, isCreditorView }) {
  return (
    <SectionSkeleton
      title={isCreditorView ? 'active payment plans' : 'payment plans'}
    >
      <div className="custom-mx-h-15 overflow-auto">
        <table className="table table-sm table-responsive position-relative table-bordered mb-0">
          <thead className="custom-bg-grey-2 text-white position-sticky top-0">
            <tr>
              <th>Plan ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {paymentPlans.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id || index}</td>
                <td>{item.amount}</td>
                <td>{friendlyDate(item.date)}</td>
              </tr>
            ))}

            {paymentPlans.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center small text-grey py-3">
                  No payment plans
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionSkeleton>
  );
}
