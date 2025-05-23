import ContentModal from "../../../../components/ContentModal.jsx";
import Layout from "../../../../components/Layouts/client/Layout.jsx";
import MessageModal from "../../../../components/MessageModal.jsx";
import useSalesCategories from "../../../../hooks/page-hooks/useSalesCategories.js";
import { friendlyDate } from "../../../../utils/index.js";

export default function SalesCategories() {
  const {
    showAdd,
    loading,
    categories,
    categoryToDelete,
    setCategoryToDelete,
    handleAddCategory,
    deleteCategory,
    openShowAdd,
    handleClose,
  } = useSalesCategories();

  return (
    <main>
      <MessageModal
        show={Boolean(categoryToDelete)}
        handleClose={() => setCategoryToDelete(null)}
        title="Delete Category"
        message={`Are you sure you want to delete ${categoryToDelete?.category}?`}
        actionButtons={
          <>
            <button
              className="btn btn-sm btn-info text-white"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancel
            </button>
            <button className="btn btn-sm btn-danger" onClick={deleteCategory}>
              Delete
            </button>
          </>
        }
      />

      <ContentModal show={showAdd} handleClose={handleClose} title="Add Category" size="md">
        <form className="px-4 pb-5" onSubmit={handleAddCategory}>
          <div className="c-bg-light p-1 mb-3 text-center">Sales Category</div>

          <div className="d-flex gap-4 justify-content-between align-items-center">
            <div>
              <label htmlFor="code" className="text-center w-100 form-label">
                Code
              </label>
              <input type="text" className="form-control" id="code" name="code" required />
            </div>

            <div>
              <label htmlFor="category" className="text-center w-100 form-label">
                Category
              </label>
              <input type="text" className="form-control" id="category" name="name" required />
            </div>
          </div>

          <div className="mt-5 text-center">
            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  <span className="d-inline-block ms-2">Saving..</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </ContentModal>

      <h5 className="position-relative text-center mb-2 p-2 mb-0">
        Sales Categories
        <div className="position-absolute top-0 end-0">
          <button className="btn btn-info text-white" onClick={openShowAdd}>
            <i className="leading-icon material-icons">add</i>
            New
          </button>
        </div>
      </h5>

      <table className="table table-sm table-striped border bg-white">
        <thead className="position-sticky c-table-top text-white bg-info shadow-sm c-z-5">
          <tr className="c-force-borders c-force-borders-white">
            <th className="ps-3">
              <div> Code</div>
            </th>
            <th>
              <div>Category </div>
            </th>
            <th>
              <div>Date Created </div>
            </th>
            <th>
              <div> </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {!Boolean(categories?.length) && (
            <tr>
              <td colSpan={4}>
                <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
                  Nothing to show
                </div>
              </td>
            </tr>
          )}

          {categories?.map((category, index) => (
            <tr key={index}>
              <td className="ps-3">{category.code}</td>

              <td className="custom-mn-w-2 ps-3">{category.name}</td>

              <td className="ps-3">
                {category.date_created && friendlyDate(category.date_created)}
              </td>

              <td className="pe-3 custom-mx-w-05 text-end">
                <button
                  onClick={() => setCategoryToDelete(category)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

SalesCategories.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
