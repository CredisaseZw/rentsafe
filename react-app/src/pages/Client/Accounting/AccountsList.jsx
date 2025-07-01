import Layout from "../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../components/ContentModal.jsx";
import useAccountsList from "../../../hooks/modal-hooks/useAccountsList.js";

export default function AccountsList() {
  const {
    loading,
    showAdd,
    accountsSectors,
    mappableAccountsList,
    openAddForm,
    handleSubmit,
    closeAddForm,
    deleteAccount,
    seedAccounts,
  } = useAccountsList();

  return (
    <div>
      <ContentModal
        centerTitle
        show={showAdd}
        handleClose={closeAddForm}
        title={"Add Account"}
        size="md"
      >
        <form className="px-4 pb-5" onSubmit={handleSubmit}>
          <div className="c-bg-light p-1 mb-3 text-center">Account</div>
          <div className="mb-3">
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

          <div className="mb-3">
            <label htmlFor="account_number" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="account_number"
              name="account_number"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="account_sector" className="form-label">
              Accounts Sector
            </label>
            <select className="form-select" id="account_sector" name="account_sector" required>
              {accountsSectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.code} - {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 text-center">
            <CustomTable.ActionButtonTemplate disabled={loading} type="submit">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="d-inline-block ms-2">saving..</span>
                </>
              ) : (
                "Save"
              )}
            </CustomTable.ActionButtonTemplate>
          </div>
        </form>
      </ContentModal>

      <CustomTable.Table tabletitle="Accounts List" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Account Number</th>
            <th>Account Name</th>
            <th>Accounts Sector</th>
            <th>
              <CustomTable.ActionButtonsContainer>
                <CustomTable.AddRowButtonTemplate onClick={openAddForm} label="New" />
                <CustomTable.ActionButtonTemplate onClick={seedAccounts}>
                  Get Accounts
                </CustomTable.ActionButtonTemplate>
              </CustomTable.ActionButtonsContainer>
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <CustomTable.LoadingIndicator colSpan={4} />
          ) : mappableAccountsList.length === 0 ? (
            <CustomTable.NothingToShow colSpan={4} />
          ) : (
            mappableAccountsList.map((account, index) => (
              <tr key={index}>
                <td>{account.accountNumber}</td>
                <td>{account.accountName}</td>
                <td>{account.accountsSector}</td>
                <td className="text-center">
                  <CustomTable.RemoveRowButtonTemplate onClick={() => deleteAccount(account.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

AccountsList.layout = (page) => <Layout children={page} title={"Accounts"} />;
