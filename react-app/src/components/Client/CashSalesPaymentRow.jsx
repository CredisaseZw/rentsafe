import CustomTable from "./table/CustomTable.jsx";

export default function CashSalesPaymentRow({
  index,
  cashBooks,
  isLoading,
  itemsLength,
  paymentItem,
  paymentTypes,
  setPaymentItems,
  removePaymentItemRow,
}) {
  return (
    <tr>
      <td>
        <CustomTable.RemoveRowButtonTemplate
          disabled={isLoading || itemsLength === 1}
          onClick={() => removePaymentItemRow(index)}
        />
      </td>

      <td>
        <select
          required
          disabled={isLoading}
          defaultValue={paymentItem.paymentType}
          className="form-select form-select-sm custom-w-2"
        >
          <option disabled value="">
            Select type..
          </option>
          {paymentTypes.map((type, index) => (
            <option key={index} value={type.id || type.type}>
              {type.type}
            </option>
          ))}
        </select>
      </td>

      <td>
        <select
          required
          disabled={isLoading}
          defaultValue={paymentItem.cashBook}
          className="form-select form-select-sm custom-w-2"
        >
          <option disabled value="">
            Select cashbook..
          </option>
          {cashBooks.map((book, index) => (
            <option key={index} value={book.id || book.name}>
              {book.name}
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          className="form-control form-control-sm custom-w-1"
          disabled={isLoading}
          value={paymentItem.detail}
          onChange={(e) =>
            setPaymentItems((prev) =>
              prev.map((prevItem, prevIndex) => {
                if (prevIndex === index) {
                  return { ...prevItem, detail: e.target.value };
                } else return prevItem;
              })
            )
          }
        />
      </td>

      <td>
        <input
          className="form-control form-control-sm custom-w-1"
          disabled={isLoading}
          value={paymentItem.ref}
          onChange={(e) =>
            setPaymentItems((prev) =>
              prev.map((prevItem, prevIndex) => {
                if (prevIndex === index) {
                  return { ...prevItem, ref: e.target.value };
                } else return prevItem;
              })
            )
          }
        />
      </td>

      <td>
        <input
          type="number"
          required
          className="form-control form-control-sm custom-w-1"
          disabled={isLoading}
          value={paymentItem.amountReceived}
          onChange={(e) =>
            setPaymentItems((prev) =>
              prev.map((prevItem, prevIndex) => {
                if (prevIndex === index) {
                  return { ...prevItem, amountReceived: e.target.value };
                } else return prevItem;
              })
            )
          }
        />
      </td>

      <td></td>
    </tr>
  );
}
