import Layout from "../../../components/Layouts/client/Layout.jsx";
import ContentModal from "../../../components/ContentModal.jsx";
import useAccountsListPage from "../../../hooks/page-hooks/useAccountsListPage.js";

export default function AccountsListPage() {
  const {
    mappableAccountsList,
    showConfirmPrompt,
    showNewAccForm,
    submittedAccs,
    setShowConfirmPrompt,
    setShowNewAccForm,
    handleAddition,
    submitUpdates,
    handleSubmit,
  } = useAccountsListPage();

  return (
    <div>
      <ContentModal
        show={showConfirmPrompt}
        handleClose={() => setShowConfirmPrompt(false)}
        size="md"
        title="Edit Account"
      >
        <p className="text-center mb-4">
          You are about to edit {submittedAccs?.length} General Ledger accounts. Click OK to accept
          or Exit to return to list
        </p>
        <div className="d-flex justify-content-center">
          <button onClick={submitUpdates} className="btn btn-info text-white me-2">
            OK
          </button>
          <button onClick={() => setShowConfirmPrompt(false)} className="btn btn-secondary">
            Exit
          </button>
        </div>
      </ContentModal>

      <ContentModal
        show={showNewAccForm}
        handleClose={() => setShowNewAccForm(false)}
        size="lg"
        title="Add General Ledger Account"
      >
        <form onSubmit={handleAddition}>
          <div className="d-flex gap-3 align-items-center justify-content-around mb-4">
            <div>
              <label htmlFor="account_name" className="form-label">
                Account Name
              </label>
              <input
                type="text"
                className="form-control"
                id="account_name"
                name="account_name"
                required
              />
            </div>

            <div>
              <label htmlFor="account_number" className="form-label">
                Account Number
              </label>
              <input className="form-control" id="account_number" name="account_number" required />
            </div>

            <div>
              <label htmlFor="accounts_sector" className="form-label">
                Accounts Sector
              </label>
              <input
                type="text"
                className="form-control"
                id="accounts_sector"
                name="accounts_sector"
                required
              />
            </div>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-info text-white">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowNewAccForm(false)}
              className="btn btn-secondary ms-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </ContentModal>

      <form onSubmit={handleSubmit}>
        <h5 className="rounded-2 bg-success text-white text-center p-1">Recurring Invoices</h5>

        <div className="text-end mb-2">
          <button
            type="button"
            onClick={() => setShowNewAccForm(true)}
            className="btn btn-info text-white"
          >
            <i className="material-icons leading-icon">add</i>
            Add Account
          </button>
        </div>

        <table className="table table-responsive table-sm table-bordered">
          <thead className="position-sticky c-table-top bg-white shadow-sm">
            <tr>
              <th>Account Name</th>
              <th>Account Number</th>
              <th>Accounts Sector</th>
              <th>Sector Name</th>
            </tr>
          </thead>

          <tbody>
            {mappableAccountsList.map((account, index) =>
              account.isEditable ? (
                <tr key={index} className="bg-white c-pointer">
                  <td>
                    <input
                      name={"account_name-" + index}
                      id={"account_name-" + index}
                      className="form-control"
                      defaultValue={account.accountName}
                      placeholder="Account Name"
                      required
                    />
                  </td>
                  <td>
                    <input
                      name={"account_number-" + index}
                      id={"account_number-" + index}
                      className="form-control"
                      defaultValue={account.accountNumber}
                      placeholder="Account Number"
                      required
                    />
                  </td>
                  <td>
                    <input
                      name={"accounts_sector-" + index}
                      id={"accounts_sector-" + index}
                      className="form-control"
                      defaultValue={account.accountsSector}
                      placeholder="Accounts Sector"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name={"sector_name-" + index}
                      id={"sector_name-" + index}
                      className="form-control"
                      defaultValue={account.sectorName}
                      placeholder="Sector Name"
                      required
                    />
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{account.accountName}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountsSector}</td>
                  <td>{account.sectorName}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className="text-end">
          <button type="submit" className="btn btn-info text-white">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

AccountsListPage.layout = (page) => <Layout children={page} title={"Accounts List"} />;
