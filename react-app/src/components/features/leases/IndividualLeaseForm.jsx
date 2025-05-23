import { Modal } from "react-bootstrap";
import Receipt from "./Receipt.jsx";
import { formatCurrency } from "../../../utils/formatting.js";
import { MultipleUpload } from "../../../components/MultipleUpload.jsx";
import useIndividualLeaseForm from "../../../hooks/modal-hooks/useIndividualLeaseForm.js";
import CustomAsyncSelect from "../../CustomAsyncSelect.jsx";

export default function IndividualLeaseForm({
  show,
  handleClose,
  action,
  lesseeDetails,
  subscriptionPeriod,
}) {
  const {
    isSingleTab,
    setIdSelectValue,
    idSelectValue,
    toggleTab,
    changeHandler,
    errors,
    monthThree,
    monthTwo,
    monthOne,
    currentDate,
    data,
    isLoading,
    showReceipt,
    isIdSelectExpanded,
    setIsIdSelectExpanded,
    viewReceipt,
    closeReceipt,
    handleSubmit,
    changeLandlordType,
    changeLandlord,
    changeRentGuarantorId,
  } = useIndividualLeaseForm(handleClose, action, lesseeDetails, subscriptionPeriod);

  console.log(data);
  console.log(data.landlordType);
  console.log(Boolean(data.landlordType));
  console.log(!Boolean(data.landlordType));
  return (
    <Modal size="lg" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="card-header bg-transparent ps-0">
        <button
          className={`btn btn-sm ${isSingleTab ? "btn-info text-white" : "btn-light"}`}
          onClick={toggleTab}
        >
          Single
        </button>
        <button
          className={`btn btn-sm ${!isSingleTab ? "btn-info text-white" : "btn-light"}`}
          onClick={toggleTab}
        >
          Multiple
        </button>
      </Modal.Header>

      <Modal.Body className="p-0">
        {isSingleTab ? (
          <div className="card card-raised">
            <div className="card-header bg-info">
              <h2 className="display-6 mb-0 text-white">
                {action === "view"
                  ? "View Lease - Individual"
                  : action === "edit"
                    ? "Edit Lease - Individual"
                    : "Add Lease - Individual"}
              </h2>
            </div>

            <div className="card-body p-4">
              <h6 className="bg-info p-1 display-6 m-0 text-center text-white">Lease details</h6>

              <form className="p-5 border border-2 border-info" onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="row">
                    <div className="mt-1 col-lg-4">
                      <label className="form-label">National ID/Passport:</label>

                      <div className="d-flex align-items-center justify-content-between">
                        <select
                          className="p-1 w-auto rounded-end-0"
                          name="identificationType"
                          id="identificationType"
                          value={idSelectValue}
                          // leave event listeners in this exact format, otherwise weird things happen
                          onFocus={() => setIsIdSelectExpanded(() => true)}
                          onMouseDown={() => setIsIdSelectExpanded(() => true)}
                          onBlur={() => setIsIdSelectExpanded(() => false)}
                          onChange={(e) => {
                            setIdSelectValue(e.target.value);
                            setIsIdSelectExpanded(() => false);
                          }}
                        >
                          <option value="id">ID</option>
                          <option value="passport">
                            {idSelectValue === "passport" || isIdSelectExpanded ? "Passport" : ""}
                          </option>
                        </select>
                        <input
                          value={data.identificationNumber}
                          onChange={changeHandler}
                          type="text"
                          required
                          name="identificationNumber"
                          id="identificationNumber"
                          className="form-control form-control-sm flex-grow-1 rounded-start-0 border-start-0"
                        />
                      </div>

                      {errors && (
                        <div className="text-danger mt-1">{errors.identificationNumber}</div>
                      )}
                    </div>

                    <div className="mt-1 col-lg-4">
                      <label className="form-label">Lessee Name:</label>
                      <input
                        value={data.lesseeName}
                        onChange={changeHandler}
                        type="text"
                        name="lesseeName"
                        required
                        id="lesseeName"
                        className="form-control form-control-sm"
                        readOnly
                      />
                      {errors && <div className="text-danger mt-1">{errors.lesseeName}</div>}
                    </div>

                    <div className="mt-1 col-lg-4">
                      <label className="form-label">Lessee Mobile Number</label>
                      <input
                        value={data.lesseePhone}
                        onChange={changeHandler}
                        type="text"
                        name="lesseePhone"
                        id="lesseePhone"
                        required
                        className="form-control form-control-sm"
                        readOnly={action === "view"}
                      />
                      {errors && <div className="text-danger mt-1">{errors.lesseePhone}</div>}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Lease Address:</label>
                    <textarea
                      value={data.lesseeAddress}
                      onChange={changeHandler}
                      type="text"
                      required={data.lesseeName ? true : false}
                      name="lesseeAddress"
                      id="lesseeAddress"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.lesseeAddress}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Rent Guarantor ID:</label>

                    <CustomAsyncSelect
                      onChange={(res) => changeRentGuarantorId(res)}
                      extraProps={{
                        required: false,
                        className: "w-100",
                        name: "rentGuarantorId",
                        id: "rentGuarantorId",
                        placeholder: data.rentGuarantorId || undefined,
                      }}
                      isDisabled={action === "view"}
                      defaultValue={action === "view" ? data.rentGuarantorId : ""}
                      useAlternateFetchOptions={{
                        type: "individual",
                      }}
                    />

                    {errors && <div className="text-danger mt-1">{errors.rentGuarantorId}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Rent Guarantor Name:</label>
                    <input
                      value={data.rentGuarantorName}
                      onChange={changeHandler}
                      type="text"
                      name="rentGuarantorName"
                      id="rentGuarantorName"
                      className="form-control form-control-sm"
                      readOnly
                    />
                    {errors && <div className="text-danger mt-1">{errors.rentGuarantorName}</div>}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Lease Details:</label>
                    <textarea
                      value={data.leaseDetails}
                      onChange={changeHandler}
                      name="leaseDetails"
                      id="leaseDetails"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.leaseDetails}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Lease Currency</label>
                    <select
                      value={data.leaseCurrency}
                      onChange={changeHandler}
                      id="leaseCurrency"
                      name="leaseCurrency"
                      className="form-select form-select-sm"
                      readOnly={action === "view"}
                    >
                      <option value="USD">USD</option>
                      <option value="ZWG">ZWG</option>
                      {/* <option value="ZAR">ZAR</option>
                              <option value="EUR">EUR</option>
                              <option value="Pula">Pula</option> */}
                    </select>
                    {errors && <div className="text-danger mt-1">{errors.leaseCurrency}</div>}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Monthly Rental:</label>
                    <input
                      value={data.monthlyRental === 0 ? "" : data.monthlyRental}
                      placeholder="enter monthly rental"
                      onChange={changeHandler}
                      type="text"
                      required={data.lesseeName ? true : false}
                      id="monthlyRental"
                      name="monthlyRental"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.monthlyRental}</div>}
                  </div>

                  <div className="mt-1 col-lg-4 d-flex flex-column">
                    <label className="form-label">Variable Rent:</label>
                    <input
                      checked={data.rentVariable}
                      onChange={changeHandler}
                      type="checkbox"
                      id="rentVariable"
                      name="rentVariable"
                      className="form-check-input border-1 p-2 border-black"
                    />
                    {errors && <div className="text-danger mt-1">{errors.rentVariable}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Deposit Period(Months):</label>
                    <input
                      value={data.depositPeriod === 0 ? "" : data.depositPeriod}
                      placeholder="enter deposit period"
                      onChange={changeHandler}
                      type="text"
                      id="depositPeriod"
                      name="depositPeriod"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.depositPeriod}</div>}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Deposit Amount:</label>
                    <input
                      value={data.depositAmount === 0 ? "" : data.depositAmount}
                      placeholder="enter deposit amount"
                      onChange={changeHandler}
                      type="text"
                      name="depositAmount"
                      id="depositAmount"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.depositAmount}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Subscription period left (months):</label>
                    <input
                      value={data.leasePeriod}
                      // onChange={changeHandler}
                      readOnly
                      type="number"
                      id="leasePeriod"
                      name="leasePeriod"
                      className="form-control form-control-sm"
                    />
                    {errors && <div className="text-danger mt-1">{errors.leasePeriod}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Lease Start Date:</label>
                    <input
                      value={data.leaseStartDate}
                      onChange={changeHandler}
                      type="date"
                      required={data.lesseeName ? true : false}
                      name="leaseStartDate"
                      id="leaseStartDate"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.leaseStartDate}</div>}
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Lease End Date:</label>

                    <input
                      value={data.leaseEndDate}
                      onChange={changeHandler}
                      type="date"
                      // required={data.lesseeName ? true : false}
                      name="leaseEndDate"
                      id="leaseEndDate"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />

                    {errors && <div className="text-danger mt-1">{errors.leaseEndDate}</div>}
                  </div>

                  <div className="col-lg-4 mt-1">
                    <label className="form-label">Payment Period Start Date:</label>
                    <input
                      value={data.paymentPeriodStart}
                      type="number"
                      id="paymentPeriodStart"
                      name="paymentPeriodStart"
                      className="form-control form-control-sm"
                      readOnly
                      disabled
                    />
                    {errors && <div className="text-danger mt-1">{errors.paymentPeriodStart}</div>}
                  </div>

                  <div className="mt-1 col-lg-4">
                    <label className="form-label">Payment Period End Date:</label>
                    <input
                      value={data.paymentPeriodEnd}
                      onChange={changeHandler}
                      type="number"
                      min="1"
                      max="31"
                      required={data.lesseeName ? true : false}
                      name="paymentPeriodEnd"
                      id="paymentPeriodEnd"
                      className="form-control form-control-sm"
                      readOnly={action === "view"}
                    />
                    {errors && <div className="text-danger mt-1">{errors.paymentPeriodEnd}</div>}
                  </div>
                </div>

                {action === "add" && (
                  <div className="mb-4">
                    <h3 className="text-center p-2 fw-bolder h6 custom-bg-grey">
                      Tenant Opening Rent Balances
                    </h3>

                    <table className="table table-responsive table-bordered">
                      <tbody>
                        <tr
                          style={{
                            lineHeight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          <th scope="row" className="fw-bold" style={{ lineHeight: "15px" }}>
                            Payment Date
                          </th>
                          <td className="" style={{ lineHeight: "15px" }}>
                            More than 3 months
                          </td>
                          <td className="" style={{ lineHeight: "15px" }}>
                            {monthThree}
                          </td>
                          <td className="" style={{ lineHeight: "15px" }}>
                            {monthTwo}
                          </td>
                          <td className="" style={{ lineHeight: "15px" }}>
                            {monthOne}
                          </td>
                          <td className="" style={{ lineHeight: "15px" }}>
                            {currentDate}
                          </td>
                          <td className="fw-bold" style={{ lineHeight: "15px" }}>
                            Outstanding Balance
                          </td>
                        </tr>
                        <tr
                          style={{
                            lineHeight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          <th scope="row" className="fw-bold">
                            Amount
                          </th>
                          <td className="bg-black text-white">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              id="moreThanThreeMonthsBalance"
                              name="moreThanThreeMonthsBalance"
                              onChange={changeHandler}
                              value={data.moreThanThreeMonthsBalance}
                            />
                          </td>
                          <td className="text-white bg-danger">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              id="monthThreeBalance"
                              name="monthThreeBalance"
                              onChange={changeHandler}
                              value={data.monthThreeBalance}
                            />
                          </td>
                          <td className="text-white custom-bg-pink">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              id="monthTwoBalance"
                              name="monthTwoBalance"
                              onChange={changeHandler}
                              value={data.monthTwoBalance}
                            />
                          </td>
                          <td className="text-white bg-warning">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              id="monthOneBalance"
                              name="monthOneBalance"
                              onChange={changeHandler}
                              value={data.monthOneBalance}
                            />
                          </td>
                          <td className="text-white bg-success">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              id="currentBalance"
                              name="currentBalance"
                              onChange={changeHandler}
                              value={data.currentBalance}
                            />
                          </td>
                          <td
                            className={`text-white d-flex align-items-center justify-content-center py-4 my-auto ${
                              Number(data.moreThanThreeMonthsBalance) > 0
                                ? "bg-black"
                                : Number(data.monthThreeBalance) > 0
                                  ? "bg-danger"
                                  : Number(data.monthTwoBalance) > 0
                                    ? "custom-bg-pink"
                                    : Number(data.monthOneBalance) > 0
                                      ? "bg-warning"
                                      : "bg-success"
                            }`}
                            style={{
                              backgroundColor: Number(data.monthTwoBalance) > 0 ? "#f87171" : "",
                            }}
                          >
                            {formatCurrency(
                              Number(data.moreThanThreeMonthsBalance) +
                                Number(data.monthThreeBalance) +
                                Number(data.monthTwoBalance) +
                                Number(data.monthOneBalance) +
                                Number(data.currentBalance) || 0
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-center p-2 fw-bolder h6 custom-bg-grey">
                    Estate Agents Section
                  </h3>

                  <div className="row align-items-center">
                    <div className="mt-1 col-lg-4">
                      <label className="form-label">Landlord Type:</label>

                      <select
                        className="form-select form-select-md"
                        name="landlordType"
                        id="landlordType"
                        value={data.landlordType}
                        disabled={action === "view"}
                        onChange={(e) => changeLandlordType(e.target.value)}
                      >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="COMPANY">Company</option>
                      </select>

                      {errors && <div className="text-danger mt-1">{errors.landlordType}</div>}
                    </div>

                    <div className="mt-1 col-lg-4">
                      <label htmlFor="regIdNumber" className="form-label">
                        {data.landlordType === "COMPANY" ? "Reg Number" : "ID"}
                        {" (or Name)"}:
                      </label>

                      <CustomAsyncSelect
                        key={data.landlordType}
                        onChange={(res) => changeLandlord(res)}
                        extraProps={{
                          required: false,
                          id: "regIdNumber",
                          className: "w-100",
                          name: "regIdNumber",
                          placeholder:
                            data.regIdNumber || data.landlordName
                              ? data.regIdNumber || "" + " - " + data.landlordName || ""
                              : "",
                        }}
                        defaultValue={data.regIdNumber ? data.regIdNumber : ""}
                        isDisabled={action === "view" || data.landlordType === ""}
                        useAlternateFetchOptions={{
                          type: data.landlordType.toLowerCase(),
                        }}
                      />

                      {errors && <div className="text-danger mt-1">{errors.idRegOrName}</div>}
                    </div>

                    <div className="mt-1 col-lg-4">
                      <label htmlFor="landlordName" className="form-label">
                        Landlord Name
                      </label>
                      <input
                        value={data.landlordName}
                        name="landlordName"
                        id="landlordName"
                        className="form-control form-control-md custom-no-pointer-events border border-2"
                        readOnly
                      />

                      {errors && <div className="text-danger mt-1">{errors.landlordName}</div>}
                    </div>

                    <div className="mt-2 col-lg-4">
                      <label htmlFor="commission" className="form-label">
                        Commission %
                      </label>
                      <input
                        value={data.commission}
                        onChange={changeHandler}
                        name="commission"
                        id="commission"
                        className="form-control form-control-sm"
                        disabled={
                          !data.landlordName ||
                          String(data.landlordName).toLowerCase().trim() === "n/a"
                        }
                      />

                      {errors && <div className="text-danger mt-1">{errors.commission}</div>}
                    </div>

                    <div className="mt-2 col-lg-4">
                      <label htmlFor="openingBalance" className="form-label">
                        Landlord Opening Balance
                      </label>
                      <input
                        value={data.openingBalance}
                        onChange={changeHandler}
                        name="openingBalance"
                        id="openingBalance"
                        className="form-control form-control-sm"
                        disabled={action === "view"}
                      />

                      {errors && <div className="text-danger mt-1">{errors.openingBalance}</div>}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end align-items-center gap-3">
                  {action === "view" ? (
                    <>
                      <button className="btn btn-info text-white" onClick={viewReceipt}>
                        Receipt
                      </button>

                      <button className="btn btn-success" onClick={handleClose}>
                        Edit
                      </button>

                      <button className="btn btn-danger" onClick={handleClose}>
                        Terminate
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary" onClick={handleClose}>
                        Cancel
                      </button>

                      <button
                        className="btn btn-info text-white"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-grow spinner-grow-sm"></span>
                            <span className="d-inline-block ml-2">processing..</span>
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>

              <Receipt show={showReceipt} handleClose={closeReceipt} />
            </div>
          </div>
        ) : (
          <MultipleUpload type="individual" actionType="lease" />
        )}
      </Modal.Body>
    </Modal>
  );
}
