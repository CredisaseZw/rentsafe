import Layout from "../../../../components/Layouts/client/Layout.jsx";
import CustomTable from "../../../../components/Client/table/CustomTable.jsx";
import ContentModal from "../../../../components/ContentModal.jsx";
import MessageModal from "../../../../components/MessageModal.jsx";
import useProductsAndServices from "../../../../hooks/page-hooks/useProductsAndServices.js";
import { friendlyDate } from "../../../../utils/index.js";

export default function ProductsAndServices() {
  const {
    items,
    loading,
    showAdd,
    categories,
    currencies,
    taxOptions,
    itemToEdit,
    itemToDelete,
    salesAccounts,
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
                  {currencies?.map((currency, index) => (
                    <option key={index} value={currency.id}>
                      {currency.currency_code} - {currency.currency_name}
                    </option>
                  ))}
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

            <select
              className="form-select"
              id="sales_account"
              name="sales_account"
              required
              defaultValue={itemToEdit ? itemToEdit.sales_account : ""}
            >
              <option value="" disabled>
                Select one
              </option>
              {salesAccounts.map((acc, index) => (
                <option key={index} value={acc.id}>
                  {acc.account_name}
                </option>
              ))}
            </select>
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

      <CustomTable.Table tabletitle="Sales Items" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[1, 1, null, 1, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th>Category</th>
            <th>Id</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Date Created</th>
            <th className="text-end">
              <CustomTable.ActionButtonTemplate icon="add" onClick={openShowAdd}>
                Add
              </CustomTable.ActionButtonTemplate>
            </th>
          </tr>
        </thead>

        <tbody>
          {!Boolean(items?.length) && <CustomTable.NothingToShow colSpan={6} />}

          {items?.map((item, index) => (
            <tr key={index}>
              <td className="text-nowrap">{item.category_object.name}</td>
              <td className="text-nowrap">{item.id}</td>
              <td className="text-nowrap">{item.name}</td>
              <td className="text-nowrap">
                {`${item.currency_object?.currency_code || ""} ${item.price} / ${item.unit_name}`}
              </td>
              <td className="text-nowrap">
                {item.date_created && friendlyDate(item.date_created)}
              </td>

              <td>
                <CustomTable.ActionButtonsContainer>
                  <CustomTable.ActionButtonTemplate onClick={() => setItemToEdit(item)}>
                    Edit
                  </CustomTable.ActionButtonTemplate>

                  <CustomTable.ActionButtonTemplate
                    variant="danger"
                    onClick={() => setItemToDelete(item)}
                  >
                    Delete
                  </CustomTable.ActionButtonTemplate>
                </CustomTable.ActionButtonsContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </CustomTable.Table>
    </main>
  );
}

ProductsAndServices.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
