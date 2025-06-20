import Layout from "../../../components/Layouts/client/Layout.jsx";
import SearchBar from "../../../components/SearchBar.jsx";
import CustomTable from "../../../components/Client/table/CustomTable.jsx";
import useCreditNote from "../../../hooks/page-hooks/useCreditNote.js";
import { friendlyDate } from "../../../utils/index.js";
import { CreditNoteForm } from "../../../components/Client/CreditNoteForm.jsx";

export default function CreditNote() {
  const { loading, creditNotes, handleFilters } = useCreditNote();

  return (
    <div>
      <div>
        <CustomTable.Table tabletitle="Credit Note" tabletitleBg="danger" tabletitleColor="white">
          <CustomTable.ColGroup ratios={[1, 1, null, 1, 1, 1]} />

          <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
            <tr>
              <td colSpan={7}>
                <div className="d-flex justify-content-between align-items-center gap-4">
                  <form onSubmit={handleFilters} className="d-flex gap-2 align-items-center">
                    <select
                      className="form-select form-select-sm custom-mn-w-1"
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
                      className="form-select form-select-sm custom-mn-w-1"
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
                  </form>

                  <div className="d-flex align-items-center gap-2 pt-1">
                    <SearchBar placeholder="Search..." searchBy="q" />
                    <CreditNoteForm triggerClassname="btn btn-danger" />
                  </div>
                </div>
              </td>
            </tr>

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
              <CustomTable.LoadingIndicator colSpan={6} />
            ) : !Boolean(creditNotes?.length) ? (
              <CustomTable.NothingToShow colSpan={6} />
            ) : (
              creditNotes?.map((note, index) => (
                <tr key={index}>
                  <td>{note.id}</td>

                  <td className="text-nowrap">
                    {note.date_created && friendlyDate(note.date_created)}
                  </td>

                  <td>{note.customer}</td>

                  <td className="text-nowrap">{note.currency}</td>

                  <td className="ps-3 text-end">{note.amount.toFixed(2)}</td>

                  <td>
                    <CustomTable.ActionButtonTemplate variant="danger">
                      View
                    </CustomTable.ActionButtonTemplate>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </CustomTable.Table>
      </div>
    </div>
  );
}

CreditNote.layout = (page) => <Layout children={page} title={"Credit Note"} />;
