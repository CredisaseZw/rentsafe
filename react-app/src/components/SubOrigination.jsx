import SearchComponent from './search.jsx';
import useSubOrigination from '../hooks/admin/component-hooks/useSubOrigination.js';
import { formatCurrency } from '../utils/formatting.js';

export default function SubOrigination() {
  const {
    data,
    errors,
    services,
    isLoading,
    searchUrl,
    sub_periods,
    subscriberType,
    subscriberName,
    setClientId,
    handleSubmit,
    setRegNumber,
    changeHandler,
    setSubscriberName,
    setSubscriberType,
  } = useSubOrigination();

  return (
    <div>
      <h5 className="p-2 m-0 bg-info text-white text-center">
        Subscription Origination
      </h5>

      <table className="table table-responsive table-sm table-bordered bg-white">
        <thead>
          <tr>
            <th>Client Type</th>
            <th>Subscriber Name</th>
            <th>Product</th>
            {/* <th>Sub Class</th> */}
            <th>Sub Period</th>
            <th>No. of Subs</th>
            <th>Start Date</th>
            <th>Currency</th>
            <th>Monthly Price</th>
            <th>Subs Amount</th>
            <th>Payment Method</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <select
                onChange={(e) => setSubscriberType(e.target.value)}
                className="form-select form-select-sm"
                name="subscriberType"
                value={subscriberType}
                required
              >
                <option value="individual">I</option>
                <option value="company">C</option>
              </select>
            </td>

            <td className="position-relative">
              <SearchComponent
                value={subscriberName}
                setValue={setSubscriberName}
                url={searchUrl}
                placeholder="Start typing"
                delay={300}
                type={subscriberType}
                setClientId={setClientId}
                setRegNumber={setRegNumber}
              />
              {errors && (
                <div className="text-danger mt-1">{errors.subscriberName}</div>
              )}
            </td>

            <td>
              <select
                onChange={changeHandler}
                required
                className="form-select form-select-sm"
                name="product"
                id="product"
                value={data.product}
              >
                <option disabled value="">
                  Select
                </option>

                {services?.map(({ id, service_name }, index) => {
                  return (
                    <option key={index} value={id}>
                      {service_name}
                    </option>
                  );
                })}
              </select>

              {errors && (
                <div className="text-danger mt-1">{errors.product}</div>
              )}
            </td>

            {/* <td>
              <select
                onChange={changeHandler}
                className="form-select form-select-sm"
                required
                name="subClass"
                id="subClass"
                value={data.subClass}
              >
                <option disabled value="">
                  Select
                </option>
                <option value={'individual'}>I</option>
                <option value={'company'}>C</option>
              </select>

              {errors && (
                <div className="text-danger mt-1">{errors.subClass}</div>
              )}
            </td> */}

            <td>
              <select
                onChange={changeHandler}
                className="form-select form-select-sm"
                required
                name="subPeriod"
                id="subPeriod"
                value={data.subPeriod}
              >
                <option disabled value="">
                  Select
                </option>
                {sub_periods?.map(({ id, name, code }, index) => {
                  return (
                    <option key={index} value={id}>
                      {name}({code})
                    </option>
                  );
                })}
              </select>
              {errors && (
                <div className="text-danger mt-1">{errors.subPeriod}</div>
              )}
            </td>

            <td>
              <input
                value={data.numberOfSubs}
                required
                onChange={changeHandler}
                type="number"
                name="numberOfSubs"
                id="numberOfSubs"
                className="form-control form-control-sm"
              />
              {errors && (
                <div className="text-danger mt-1">{errors.numberOfSubs}</div>
              )}
            </td>

            <td>
              <input
                value={data.startDate}
                onChange={changeHandler}
                required
                type="date"
                name="startDate"
                id="startDate"
                className="form-control form-control-sm"
              />
              {errors && (
                <div className="text-danger mt-1">{errors.startDate}</div>
              )}
            </td>

            <td>
              <select
                onChange={changeHandler}
                className="form-select form-select-sm"
                name="currency"
                required
                id="currency"
                value={data.currency}
              >
                <option disabled value="">
                  Select
                </option>
                <option value={'USD'}>USD</option>
                <option value={'ZWG'}>ZWG</option>
              </select>

              {errors && (
                <div className="text-danger mt-1">{errors.currency}</div>
              )}
            </td>

            <td>
              {data.currency === 'USD'
                ? formatCurrency(data.monthlyPrice)
                : formatCurrency(data.monthlyPriceZWL)}
              {errors && (
                <div className="text-danger mt-1">{errors.monthlyPrice}</div>
              )}
            </td>

            <td>
              {formatCurrency(data.subsAmount)}
              {errors && (
                <div className="text-danger mt-1">{errors.subsAmount}</div>
              )}
            </td>

            <td>
              <select
                onChange={changeHandler}
                className="form-select form-select-sm"
                required
                name="paymentMethod"
                id="paymentMethod"
                value={data.paymentMethod}
              >
                <option disabled value="">
                  Select
                </option>

                <option value="CASH USD">CASH USD</option>
                <option value="SWIPE USD">SWIPE USD</option>
                <option value="SWIPE ZWG">SWIPE ZWG</option>
                <option value="BANK TRF USD">BANK TRF USD</option>
                <option value="BANK TRF ZWG">BANK TRF ZWG</option>
                <option value="ECOCASH USD">ECOCASH USD</option>
                <option value="ECOCASH ZWG">ECOCASH ZWG</option>
              </select>

              {errors && (
                <div className="text-danger mt-1">{errors.paymentMethod}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <span className="spinner-grow spinner-grow-sm"></span>
              <span className="ms-2">processing..</span>
            </>
          ) : (
            <>
              <i className="leading-icon material-icons">add</i>
              Submit
            </>
          )}
        </button>
      </div>
    </div>
  );
}
