import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../components/ContentModal.jsx";
import MessageModal from "../../../components/MessageModal.jsx";
import useCashBooksList from "../../../hooks/page-hooks/useCashBooksList.js";

export default function CashBooksList() {
  const {
    loading,
    cashBooks,
    accountTypes,
    showDetailsFor,
    cashBookToDelete,
    shouldShowAddForm,
    generalLedgerAccountNumbers,
    handleEdit,
    handleClose,
    handleDelete,
    handleSubmit,
    openCashbookForm,
    setShowDetailsFor,
    setCashBookToDelete,
    changeActiveRequisitionFor,
  } = useCashBooksList();

  return (
    <main>
      <>
        <MessageModal
          show={Boolean(cashBookToDelete)}
          handleClose={() => setCashBookToDelete(null)}
          title="Delete Cashbook"
          message={`Are you sure you want to delete ${cashBookToDelete?.cashBookName || ""}?`}
          actionButtons={
            <>
              <button
                className="btn btn-sm btn-info text-white"
                onClick={() => setCashBookToDelete(null)}
              >
                Cancel
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </>
          }
        />

        {shouldShowAddForm && (
          <ContentModal
            show={shouldShowAddForm}
            handleClose={handleClose}
            title="Add Cashbook"
            size="md"
          >
            <form className="px-4 pb-5" onSubmit={handleSubmit}>
              <div className="bg-dark text-white p-1 mb-3 text-center">Cashbook Details</div>

              <div className="mb-3">
                <label htmlFor="cashbook_id" className="form-label">
                  Cashbook Id*
                </label>
                <input className="form-control" id="cashbook_id" name="cashbook_id" required />
              </div>

              <div className="mb-3">
                <label htmlFor="cashbook_name" className="form-label">
                  Cashbook Name*
                </label>
                <input className="form-control" id="cashbook_name" name="cashbook_name" required />
              </div>

              <div className="mb-3">
                <label htmlFor="currency" className="form-label">
                  Currency*
                </label>

                <select
                  className="form-select "
                  id="currency"
                  name="currency"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="ZWG">ZWG</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="mb-3 d-flex align-items-center gap-4 py-2">
                <label htmlFor="cashbook_name" className="form-label">
                  Active Requisition*
                </label>

                <div className="d-flex align-items-center gap-3 justify-content-evenly flex-fill">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="active_requisition"
                      id="active_requisition_yes"
                      value="yes"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="active_requisition_yes">
                      Yes
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="active_requisition"
                      id="active_requisition_no"
                      value="no"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="active_requisition_no">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="account_type" className="form-label">
                  Account Type*
                </label>

                <select
                  className="form-select "
                  id="account_type"
                  name="account_type"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {accountTypes.map((accType, index) => (
                    <option key={index} value={accType}>
                      {accType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="bank_account_number" className="form-label">
                  Bank Account Number
                </label>
                <input
                  className="form-control"
                  id="bank_account_number"
                  name="bank_account_number"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="branch" className="form-label">
                  Branch
                </label>
                <input className="form-control" id="branch" name="branch" />
              </div>

              <div className="mb-3">
                <label htmlFor="general_ledger_account_number" className="form-label">
                  General Ledger Account #*
                </label>

                <select
                  className="form-select "
                  id="general_ledger_account_number"
                  name="general_ledger_account_number"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {generalLedgerAccountNumbers.map((accNum, index) => (
                    <option key={index} value={accNum}>
                      {accNum}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 text-center">
                <button disabled={loading} type="submit" className="btn btn-info text-white">
                  {loading ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span className="d-inline-block ms-2">saving..</span>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </ContentModal>
        )}

        {showDetailsFor && (
          <ContentModal
            show={Boolean(showDetailsFor)}
            handleClose={() => setShowDetailsFor(null)}
            title="Cashbook Details"
            size="md"
          >
            <form onSubmit={handleEdit} className="px-4 pb-5">
              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="cashbook_id" className="w-50 form-label">
                  Id
                </label>
                <input
                  className="form-control"
                  id="cashbook_id"
                  name="cashbook_id"
                  required
                  defaultValue={showDetailsFor.bookId}
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="account_name" className="w-50 form-label">
                  Name
                </label>
                <input
                  className="form-control"
                  id="account_name"
                  name="account_name"
                  required
                  defaultValue={showDetailsFor.cashBookName}
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="currency" className="w-50 form-label">
                  Currency
                </label>

                <select
                  className="form-select "
                  id="currency"
                  name="currency"
                  required
                  defaultValue={showDetailsFor.cashBookCurrency}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="ZWG">ZWG</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="mb-3 d-flex align-items-center gap-3">
                <label htmlFor="cashbook_name" className="form-label">
                  Active Requisition*
                </label>

                <div className="d-flex align-items-center gap-3 justify-content-evenly flex-fill">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="active_requisition"
                      id="active_requisition_yes"
                      value="yes"
                      defaultChecked={showDetailsFor.activeRequisition}
                    />
                    <label className="form-check-label" htmlFor="active_requisition_yes">
                      Yes
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="active_requisition"
                      id="active_requisition_no"
                      value="no"
                      defaultChecked={!showDetailsFor.activeRequisition}
                    />
                    <label className="form-check-label" htmlFor="active_requisition_no">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="account_type" className="w-50 form-label">
                  Account Type
                </label>

                <select
                  className="form-select "
                  id="account_type"
                  name="account_type"
                  required
                  defaultValue={showDetailsFor.accountType}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {accountTypes.map((accType, index) => (
                    <option key={index} value={accType}>
                      {accType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="bank_account_number" className="w-50 form-label">
                  Account Number
                </label>
                <input
                  className="form-control"
                  id="bank_bank_account_number"
                  name="bank_account_number"
                  defaultValue={showDetailsFor.bankAccountNumber}
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="branch" className="w-50 form-label">
                  Branch
                </label>
                <input
                  className="form-control"
                  id="branch"
                  name="branch"
                  defaultValue={showDetailsFor.branch}
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-3 justify-content-between">
                <label htmlFor="general_ledger_account_number" className="w-50 form-label">
                  GL Acc #
                </label>

                <select
                  className="form-select "
                  id="general_ledger_account_number"
                  name="general_ledger_account_number"
                  required
                  defaultValue={showDetailsFor.generalLedgerAccountNumber}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {generalLedgerAccountNumbers.map((accNum, index) => (
                    <option key={index} value={accNum}>
                      {accNum}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 text-center">
                <button disabled={loading} type="submit" className="btn btn-info text-white">
                  {loading ? (
                    <>
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span className="d-inline-block ms-2">updating..</span>
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </ContentModal>
        )}
      </>

      <CustomTable.Table tabletitle="Cash Books" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, 1, 1, 1, null, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Book ID</th>
            <th>Cashbook Name</th>
            <th>Currency</th>
            <th>Active Requisition</th>
            <th>GL Account Number</th>
            <th>Details</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {cashBooks?.length === 0 && <CustomTable.NothingToShow colSpan={7} />}

          {cashBooks?.map((book, index) => (
            <tr key={index}>
              <td>{book.bookId}</td>
              <td>{book.cashBookName}</td>
              <td className="text-center">{book.cashBookCurrency}</td>

              <td className="text-center">
                {book.activeRequisition}
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={book.activeRequisition}
                  onChange={(e) => changeActiveRequisitionFor(book.bookId, e.target.checked)}
                />
              </td>

              <td className="text-center">{book.bankAccountNumber}</td>
              <td>{book.details}</td>

              <td>
                <CustomTable.ActionButtonsContainer>
                  <CustomTable.ActionButtonTemplate onClick={() => setShowDetailsFor(book)}>
                    Details
                  </CustomTable.ActionButtonTemplate>

                  <CustomTable.ActionButtonTemplate
                    variant="dark"
                    children="—"
                    onClick={() => setCashBookToDelete(book)}
                  />
                </CustomTable.ActionButtonsContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </CustomTable.Table>

      <div className="text-end">
        <CustomTable.ActionButtonTemplate icon="add" variant="success" onClick={openCashbookForm}>
          New Cash Book
        </CustomTable.ActionButtonTemplate>
      </div>
    </main>
  );
}

CashBooksList.layout = (page) => <Layout children={page} title={"Cash Books List"} />;
