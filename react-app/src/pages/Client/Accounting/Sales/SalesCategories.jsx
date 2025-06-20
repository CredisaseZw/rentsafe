import Layout from "../../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../../components/ContentModal.jsx";
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

      <CustomTable.Table tabletitle="Sales Categories" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, null, null, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Code</th>
            <th>Category</th>
            <th>Date Created</th>
            <th>
              <CustomTable.ActionButtonTemplate variant="info" onClick={openShowAdd} icon="add">
                New
              </CustomTable.ActionButtonTemplate>
            </th>
          </tr>
        </thead>

        <tbody>
          {!Boolean(categories?.length) && <CustomTable.NothingToShow colSpan={4} />}

          {categories?.map((category, index) => (
            <tr key={index}>
              <td>{category.code}</td>

              <td>{category.name}</td>

              <td>{category.date_created && friendlyDate(category.date_created)}</td>

              <td>
                <CustomTable.ActionButtonTemplate
                  variant="danger"
                  onClick={() => setCategoryToDelete(category)}
                >
                  Delete
                </CustomTable.ActionButtonTemplate>
              </td>
            </tr>
          ))}
        </tbody>
      </CustomTable.Table>
    </main>
  );
}

SalesCategories.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
