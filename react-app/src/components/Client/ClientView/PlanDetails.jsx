import { truncate } from "lodash";
import { friendlyDate } from "../../../utils/index.js";
import SectionSkeleton from "./SectionSkeleton.jsx";

export default function PlanDetails({
  newPaymentPlans,
  confirmNewPaymentPlans,
  clearNewPaymentPlans,
  error,
  setError,
  isLoading,
  currency,
}) {
  return (
    <SectionSkeleton title="plan details">
      <div className="p-3 pb-2">
        <div className="custom-h-07 overflow-auto">
          {newPaymentPlans.map((plan, index) => (
            <div key={index} className="p-1 small border-bottom">
              {`${plan.spoke_with || ""} promised to pay ${String(currency || "").toUpperCase()} ${plan.amount} on ${friendlyDate(plan.expected_pay_date)}`}
            </div>
          ))}

          {newPaymentPlans.length === 0 && (
            <div className="text-center small text-grey py-3">No new payment plans</div>
          )}
        </div>

        <div className="pt-2 bg-white">
          {error && (
            <p className="d-flex align-items-start gap-1 small text-danger">
              <button
                type="button"
                onClick={() => setError("")}
                className="btn-close btn-sm"
              ></button>

              {truncate(error, { length: 150 })}
            </p>
          )}

          <div className="d-flex gap-3">
            <button
              type="button"
              onClick={confirmNewPaymentPlans}
              className="d-block btn btn-info w-100 text-white"
              disabled={isLoading || !newPaymentPlans.length}
            >
              {isLoading ? "Saving..." : "Save plan"}
            </button>

            <button
              type="button"
              onClick={clearNewPaymentPlans}
              className="d-block btn btn-dark w-100 text-white"
              disabled={isLoading || !newPaymentPlans.length}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </SectionSkeleton>
  );
}
