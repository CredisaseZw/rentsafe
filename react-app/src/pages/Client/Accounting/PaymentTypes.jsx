import usePaymentTypes from "../../../hooks/page-hooks/usePaymentTypes.js";
import ContentModal from "../../../components/ContentModal.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";

export default function PaymentTypes() {
  const {
    showAdd,
    loading,
    paymentTypes,
    closeAddModal,
    openAddModal,
    handleAddType,
    handleDeleteType,
  } = usePaymentTypes();

  return (
    <div>
      <ContentModal show={showAdd} handleClose={closeAddModal} title="New Payment Type" size="sm">
        <form className="p-4" onSubmit={handleAddType}>
          <div>
            <label htmlFor="new_type" className="text-center w-100 form-label">
              New type:
            </label>
            <input className="form-control" id="new_type" name="new_type" required />
          </div>

          <div className="mt-5 text-center">
            <button disabled={loading} type="submit" className="btn btn-info text-white">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="d-inline-block ms-2">Saving..</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </ContentModal>

      <CustomTable.Table tabletitle="Payment Types" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[null, 1]} />

        <thead>
          <tr>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paymentTypes.map((type, index) => (
            <tr key={index}>
              <td>{type.type}</td>
              <td className="text-end ">
                <CustomTable.ActionButtonTemplate
                  onClick={() => handleDeleteType(type.type)}
                  disabled={loading}
                  title="Delete"
                  children="—"
                  variant="dark"
                />
              </td>
            </tr>
          ))}

          {paymentTypes.length === 0 && <CustomTable.NothingToShow colSpan={2} />}
        </tbody>
      </CustomTable.Table>

      <div className="text-end mt-4">
        <CustomTable.ActionButtonTemplate
          onClick={openAddModal}
          disabled={loading}
          type="button"
          icon="add"
          children="Add Type"
        ></CustomTable.ActionButtonTemplate>
      </div>
    </div>
  );
}

PaymentTypes.layout = (page) => <Layout children={page} title={"Payment Types"} />;
