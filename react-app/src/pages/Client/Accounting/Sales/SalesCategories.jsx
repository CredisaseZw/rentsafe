import Layout from '../../../../components/Layouts/client/Layout.jsx';
import { friendlyDate } from '../../../../utils/index.js';

export default function SalesCategories({ categories = [] }) {
  return (
    <main>
      <h5 className="position-relative text-center mb-2 p-2 mb-0">
        Sales Categories
        <div className="position-absolute top-0 end-0">
          <button className="btn btn-info text-white">
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

              <td>{category.category}</td>

              <td>{friendlyDate(category.date_created)}</td>

              <td className="pe-3">
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

SalesCategories.layout = (page) => (
  <Layout children={page} title={'Sales Categories'} />
);
