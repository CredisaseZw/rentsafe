import { useState } from "react";
import SectionSkeleton from "./SectionSkeleton.jsx";

export default function PaymentPlan({ addNewPaymentPlan, isCreditorView }) {
  const [amount, setAmount] = useState("");

  function changeAmount(e) {
    let value = e.target.value;

    if (value.includes(".")) {
      const [integerPart, decimalPart] = value.split(".");
      if (decimalPart.length > 2) {
        value = `${integerPart}.${decimalPart.substring(0, 2)}`;
      }
    }
    setAmount(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const submitData = Object.fromEntries(new FormData(e.target).entries());
    addNewPaymentPlan(submitData);
  }

  return (
    <SectionSkeleton title="payment plans">
      <form onSubmit={handleSubmit} className="p-3">
        {!isCreditorView && (
          <div className="d-flex justify-content-between align-items-center gap-5 mb-2">
            <label htmlFor="spoke_with" className="text-nowrap">
              Person spoken with:
            </label>
            <input
              type="text"
              name="spoke_with"
              id="spoke_with"
              placeholder="Person spoken with here"
              className="custom-form-control border-0 border-bottom border-bottom-3 border-dark"
              required
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center gap-5 mb-2">
          <label htmlFor="expected_pay_date" className="text-nowrap">
            Expected Pay Date:
          </label>
          <input
            type="date"
            name="expected_pay_date"
            id="expected_pay_date"
            className="custom-form-control border-0 custom-pointer border-bottom border-bottom-3 border-dark"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center gap-5 mb-2">
          <label htmlFor="amount" className="text-nowrap">
            Amount ($):
          </label>
          <input
            min={0}
            type="number"
            step="0.01"
            name="amount"
            id="amount"
            value={amount}
            onChange={changeAmount}
            placeholder="Amount in $"
            className="custom-form-control border-0 border-bottom border-bottom-3 border-dark"
            required
          />
        </div>
        <button type="submit" className="d-block btn btn-info w-100 mt-4 text-white">
          Add to payment plan
        </button>
      </form>
    </SectionSkeleton>
  );
}
