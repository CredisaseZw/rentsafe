import ContentModal from "../../../components/ContentModal.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import MessageModal from "../../../components/MessageModal.jsx";
import useCashBooksList from "../../../hooks/page-hooks/useCashBooksList.js";

export default function CashBooksList({ currencies = [] }) {
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
  } = useCashBooksList();

  return (
    <main>
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
              <input className="form-control" id="bank_account_number" name="bank_account_number" />
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

      <h5 className="bg-info text-white rounded-3 text-center p-2 mb-0">Cash Books</h5>

      <div className="text-end my-2">
        <button className="btn btn-success" onClick={openCashbookForm}>
          <i className="leading-icon material-icons">add</i>
          New Cash Book
        </button>
      </div>

      <table className="table table-sm table-responsive table-bordered bg-white">
        <thead className="position-sticky c-table-top shadow-sm c-z-5">
          <tr>
            <th className="ps-3">Book ID</th>
            <th className="ps-3">Cashbook Name</th>
            <th className="ps-3">Cashbook Currency</th>
            <th className="ps-3">GL Account Number</th>
            <th className="ps-3">Details</th>
            <th className="ps-3"></th>
          </tr>
        </thead>

        <tbody>
          {cashBooks?.length === 0 && (
            <tr>
              <td colSpan={6}>
                <div className="p-5 bg-white d-flex justify-content-center align-items-center">
                  Nothing to show
                </div>
              </td>
            </tr>
          )}

          {cashBooks?.map((book, index) => (
            <tr key={index}>
              <td className="ps-3">{book.bookId}</td>
              <td className="ps-3 custom-mn-w-3">{book.cashBookName}</td>
              <td className="ps-3">{book.cashBookCurrency}</td>
              <td className="ps-3">{book.bankAccountNumber}</td>
              <td className="ps-3">{book.details}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-info text-white me-2"
                  onClick={() => setShowDetailsFor(book)}
                >
                  Details
                </button>
                <button className="btn btn-sm btn-dark" onClick={() => setCashBookToDelete(book)}>
                  <i className="material-icons">remove</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

CashBooksList.layout = (page) => <Layout children={page} title={"Cash Books List"} />;
