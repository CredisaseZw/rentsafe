import { friendlyDate } from "../../../utils/index.js";
import SearchBar from "../../../components/SearchBar.jsx";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import useCreditNote from "../../../hooks/page-hooks/useCreditNote.js";
import { CreditNoteForm } from "../../../components/Client/CreditNoteForm.jsx";

export default function CreditNote() {
  const { loading, creditNotes, handleFilters } = useCreditNote();

  return (
    <div>
      <h5 className="mb-4 bg-danger text-center p-2 rounded-2 text-white">Credit Note</h5>

      <div className="d-flex justify-content-between align-items-center gap-4 mb-5">
        <form onSubmit={handleFilters} className="d-flex border  gap-2 align-items-center">
          <select
            className="form-select"
            name="year"
            id="year"
            required
            defaultValue={new Date().getFullYear()}
          >
            {new Array(new Date().getFullYear() - 2020).fill(0).map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            name="month"
            id="month"
            required
            defaultValue={(new Date().getMonth() + 1).toString()}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <div>
            <button type="submit" className="btn btn-success ">
              Submit
            </button>
          </div>
        </form>

        <div className="custom-mx-w-4">
          <SearchBar placeholder="Search..." searchBy="q" />
        </div>
      </div>

      <div>
        <h5 className="position-relative text-center mb-2 p-2 mb-0">
          Credit Note List
          <div className="position-absolute top-0 end-0">
            <CreditNoteForm triggerClassname="btn btn-danger" />
          </div>
        </h5>

        <table className="table table-sm table-bordered table-responsive bg-white">
          <thead className="position-sticky c-table-top text-white bg-danger shadow-sm c-z-5">
            <tr>
              <th className="ps-3">Cr Note. #</th>
              <th>Date Created</th>
              <th>Customer</th>
              <th>Currency</th>
              <th className="text-end">Amount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-3 bg-white d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : !Boolean(creditNotes?.length) ? (
              <tr>
                <td colSpan={6}>
                  <div className="custom-h-2 bg-white d-flex justify-content-center align-items-center">
                    Nothing to show
                  </div>
                </td>
              </tr>
            ) : (
              creditNotes?.map((note, index) => (
                <tr key={index}>
                  <td className="ps-3">{note.id}</td>

                  <td className="ps-3">{note.date_created && friendlyDate(note.date_created)}</td>

                  <td className="ps-3">{note.customer}</td>

                  <td className="ps-3">{note.currency}</td>

                  <td className="ps-3 text-end">{note.amount.toFixed(2)}</td>

                  <td className="d-flex justify-content-center align-items-center p-1">
                    <button className="btn btn-sm w-100 justify-content-center btn-danger">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CreditNote.layout = (page) => <Layout children={page} title={"Sales Categories"} />;
