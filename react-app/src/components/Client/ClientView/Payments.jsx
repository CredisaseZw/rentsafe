import usePaymentPlans from '../../../hooks/component-hooks/usePaymentPlans.js';
import PaymentPlan from './PaymentPlan.jsx';
import PaymentPlans from './PaymentPlans.jsx';
import PlanDetails from './PlanDetails.jsx';

export default function Payments({
  isCreditorView,
  paymentPlans: initialPaymentPlans,
  clientId,
  refreshClientViewData,
  creditorName,
  leaseId,
  currency,
}) {
  const {
    paymentPlans,
    newPaymentPlans,
    addNewPaymentPlan,
    confirmNewPaymentPlans,
    clearNewPaymentPlans,
    error,
    setError,
    isLoading,
  } = usePaymentPlans(
    initialPaymentPlans,
    clientId,
    refreshClientViewData,
    isCreditorView,
    creditorName,
    leaseId
  );

  return (
    <>
      <PaymentPlan
        isCreditorView={isCreditorView}
        addNewPaymentPlan={addNewPaymentPlan}
        clientId={clientId}
      />
      <PlanDetails
        {...{
          isCreditorView,
          newPaymentPlans,
          confirmNewPaymentPlans,
          clearNewPaymentPlans,
          error,
          setError,
          isLoading,
          currency,
        }}
      />
      <PaymentPlans
        isCreditorView={isCreditorView}
        paymentPlans={paymentPlans}
      />
    </>
  );
}
