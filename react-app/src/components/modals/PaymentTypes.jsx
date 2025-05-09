import ClientSidebarNavItemModal from "../ClientSidebarNavItemModal.jsx";
import usePaymentTypes from "../../hooks/modal-hooks/usePaymentTypes.js";
import ContentModal from "../ContentModal.jsx";

export default function PaymentTypes(props) {
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
    <ClientSidebarNavItemModal
      {...props}
      modalProps={{
        title: "Payment Types",
        size: "md",
        children: (
          <div>
            <ContentModal
              show={showAdd}
              handleClose={closeAddModal}
              title="New Payment Type"
              size="sm"
            >
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

            <table className="w-100">
              <tbody>
                {paymentTypes.map((type, index) => (
                  <tr key={index}>
                    <td className="p-2 ">{type.type}</td>
                    <td className="p-2 text-end ">
                      <button
                        onClick={() => handleDeleteType(type.type)}
                        disabled={loading}
                        type="button"
                        title="Delete"
                        className="btn btn-sm btn-dark justify-content-center"
                      >
                        <i className="material-icons"> remove</i>
                      </button>
                    </td>
                  </tr>
                ))}

                {paymentTypes.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center p-5">
                      Nothing to show
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="text-center mt-4">
              <button
                onClick={openAddModal}
                disabled={loading}
                type="button"
                className="btn w-100 justify-content-center btn-info text-white"
              >
                <i className="material-icons me-2">add</i>
                Add Type
              </button>
            </div>
          </div>
        ),
      }}
    />
  );
}
