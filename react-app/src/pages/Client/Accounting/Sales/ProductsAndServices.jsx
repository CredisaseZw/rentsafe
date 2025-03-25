import ContentModal from "../../../../components/ContentModal.jsx";
import Layout from "../../../../components/Layouts/client/Layout.jsx";
import MessageModal from "../../../../components/MessageModal.jsx";
import useProductsAndServices from "../../../../hooks/page-hooks/useProductsAndServices.js";
import { friendlyDate } from "../../../../utils/index.js";

export default function ProductsAndServices({ currencies = [] }) {
  const {
    items,
    loading,
    showAdd,
    categories,
    taxOptions,
    itemToEdit,
    itemToDelete,
    setItemToDelete,
    setItemToEdit,
    handleItemAddition,
    handleDelete,
    openShowAdd,
    handleClose,
    handleEdit,
  } = useProductsAndServices();

  return (
    <main>
      <MessageModal
        show={Boolean(itemToDelete)}
        handleClose={() => setItemToDelete(null)}
        title="Delete Item"
        message={`Are you sure you want to delete ${itemToDelete?.name}?`}
        actionButtons={
          <>
            <button
              className="btn btn-sm btn-info text-white"
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      />

      <ContentModal
        show={showAdd || Boolean(itemToEdit)}
        handleClose={handleClose}
        title={itemToEdit ? "Edit Item" : "Add Item"}
        size="md"
      >
        <form className="px-4 pb-5" onSubmit={itemToEdit ? handleEdit : handleItemAddition}>
          <div className="c-bg-light p-1 mb-3 text-center">Item</div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Item Category
            </label>

            <select
              className="form-select "
              id="category"
              name="category"
              // required
              defaultValue={itemToEdit ? itemToEdit.category : ""}
            >
              <option value="" disabled>
                Select one
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              Item Id
            </label>
            <input
              type="text"
              className="form-control"
              id="item_id"
              name="item_id"
              required
              defaultValue={itemToEdit?.id}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Item Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              required
              defaultValue={itemToEdit?.name}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Unit Price</label>
            <div className="d-flex justify-content-between align-items-center">
              <div className="w-50 d-flex">
                <label
                  htmlFor="unit_price_currency"
                  className="px-2 text-nowrap c-bg-light d-flex align-items-center"
                >
                  Currency
                </label>

                <select
                  className="form-select rounded-0 px-1"
                  id="unit_price_currency"
                  name="unit_price_currency"
                  required
                  defaultValue={itemToEdit ? itemToEdit.unit_price_currency : ""}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {currencies?.length ? (
                    currencies.map((currency, index) => (
                      <option key={index} value={currency}>
                        {currency}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="USD">USD</option>
                      <option value="ZIG">ZIG</option>
                    </>
                  )}
                </select>
              </div>

              <div className="w-50 d-flex">
                <label
                  htmlFor="price"
                  className="px-2 text-nowrap c-bg-light d-flex align-items-center"
                >
                  Unit Price
                </label>

                <input
                  type="number"
                  className="form-control rounded-0"
                  id="price"
                  name="price"
                  required
                  defaultValue={itemToEdit ? itemToEdit.price : ""}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="unit_name" className="form-label">
              Unit Name (optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="unit_name"
              name="unit_name"
              defaultValue={itemToEdit ? itemToEdit.unit_name : ""}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tax_configuration" className="form-label">
              Tax Configuration
            </label>
            <select
              className="form-select "
              id="tax_configuration"
              name="tax_configuration"
              // required
              defaultValue={itemToEdit ? itemToEdit.tax_configuration : ""}
            >
              <option value="" disabled>
                Select one
              </option>

              {taxOptions.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.description} - {option.rate}%
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="sales_account" className="form-label">
              Sales Account
            </label>
            <input
              type="text"
              className="form-control"
              id="sales_account"
              name="sales_account"
              required
              defaultValue={itemToEdit ? itemToEdit.sales_account : ""}
            />
          </div>

          <div className="mt-5 text-center">
            <button disabled={loading} type="submit" className="btn btn-primary">
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

      <h5 className="position-relative text-center mb-2 p-2 mb-0">
        Sales Items
        <div className="position-absolute top-0 end-0">
          <button className="btn btn-info text-white" onClick={openShowAdd}>
            <i className="leading-icon material-icons">add</i>
            Add
          </button>
        </div>
      </h5>

      <table className="table table-sm table-striped border bg-white">
        <thead className="position-sticky c-table-top text-white bg-info shadow-sm c-z-5">
          <tr className="c-force-borders c-force-borders-white">
            <th className="ps-3">
              <div>Category</div>
            </th>
            <th>
              <div>Id </div>
            </th>
            <th>
              <div>Name </div>
            </th>
            <th>
              <div>Unit Price </div>
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
          {!Boolean(items?.length) && (
            <tr>
              <td colSpan={6}>
                <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
                  Nothing to show
                </div>
              </td>
            </tr>
          )}

          {items?.map((item, index) => (
            <tr key={index}>
              <td className="ps-3">{item.category_name}</td>

              <td className="ps-3">{item.id}</td>

              <td className="ps-3">{item.name}</td>

              <td className="ps-3">
                {" "}
                {`${item.unit_price_currency} ${item.price} / ${item.unit_name}`}
              </td>

              <td className="ps-3">{item.date_created && friendlyDate(item.date_created)}</td>

              <td className="d-flex gap-2 justify-content-end pe-3">
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => setItemToEdit(item)}
                >
                  Edit
                </button>

                <button className="btn btn-sm btn-danger" onClick={() => setItemToDelete(item)}>
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

ProductsAndServices.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
