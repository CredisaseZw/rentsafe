import React from "react";
import Layout from "../../../components/Layouts/client/Layout.jsx";
import useGeneralJournal from "../../../hooks/page-hooks/useGeneralJournal.js";

export default function GeneralJournal() {
  const {
    entries,
    generalLedgerAccounts,
    addEntry,
    postData,
    removeEntry,
    addAdditionalLine,
    toggleDirectContra,
    removeAdditionalLine,
    handleFirstLineChange,
    handleAdditionalLineChange,
  } = useGeneralJournal();

  return (
    <div>
      <h5 className="text-center">General Journal</h5>
      <div className="d-flex gap-3 mb-3">
        Date <b> {new Date().toISOString().split("T")[0]}</b>
      </div>

      <table className="table table-sm bg-white table-bordered table-responsive">
        <thead>
          <tr>
            <th>Period</th>
            <th>Reference</th>
            <th>Account</th>
            <th className="custom-mn-w-3">Description</th>
            <th>DR</th>
            <th>CR</th>
            <th>Direct Contra</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry, entryIndex) => (
            <React.Fragment key={entryIndex}>
              {/* first line */}
              <tr>
                <td>
                  <select
                    className="c-form-select"
                    name="period"
                    value={entry.firstLine.period}
                    onChange={(e) => handleFirstLineChange(e, entryIndex)}
                  >
                    {new Array(12).fill(0).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{entry.firstLine.ref + (entryIndex + 1)}</td>

                <td>
                  <select
                    className="c-form-select"
                    name="account"
                    value={entry.firstLine.account}
                    onChange={(e) => handleFirstLineChange(e, entryIndex)}
                  >
                    <option value="" disabled>
                      select one
                    </option>
                    {generalLedgerAccounts.map((account, index) => (
                      <option key={index} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="enter description..."
                    value={entry.firstLine.description}
                    onChange={(e) => handleFirstLineChange(e, entryIndex)}
                  />
                </td>

                <td>
                  <input
                    disabled={entry.firstLine.cr > 0 || entry.firstLine.cr < 0}
                    type="number"
                    className="form-control"
                    style={{ maxWidth: "15ch" }}
                    name="dr"
                    placeholder="0.00"
                    value={entry.firstLine.dr}
                    onChange={(e) => handleFirstLineChange(e, entryIndex)}
                  />
                </td>

                <td>
                  <input
                    disabled={entry.firstLine.dr > 0 || entry.firstLine.dr < 0}
                    type="number"
                    className="form-control"
                    style={{ maxWidth: "15ch" }}
                    name="cr"
                    placeholder="0.00"
                    value={entry.firstLine.cr}
                    onChange={(e) => handleFirstLineChange(e, entryIndex)}
                  />
                </td>

                <td>
                  <div className="form-check d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      name="directContra"
                      type="checkbox"
                      value="yes"
                      checked={entry.firstLine.directContra === "yes"}
                      onChange={() => toggleDirectContra(entryIndex)}
                    />
                  </div>
                </td>

                <td>
                  <button
                    disabled={entries.length === 1}
                    className="btn btn-sm btn-danger "
                    onClick={() => removeEntry(entryIndex)}
                  >
                    <i className="material-icons">close</i>
                  </button>
                </td>
              </tr>

              {/* additional lines */}
              {entry.additionalLines.map((line, lineIndex) => (
                <tr key={lineIndex}>
                  <td>
                    <select
                      className="c-form-select"
                      name="period"
                      value={line.period}
                      disabled={entry.firstLine.directContra === "yes"}
                      onChange={(e) => handleAdditionalLineChange(e, entryIndex, lineIndex)}
                    >
                      {new Array(12).fill(0).map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>{entry.firstLine.ref + (entryIndex + 1)}</td>

                  <td>
                    <select
                      className="c-form-select"
                      name="account"
                      value={line.account}
                      onChange={(e) => handleAdditionalLineChange(e, entryIndex, lineIndex)}
                    >
                      <option value="" disabled>
                        select one
                      </option>
                      {generalLedgerAccounts.map((account, index) => (
                        <option key={index} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      name="description"
                      placeholder="enter description..."
                      value={line.description}
                      onChange={(e) => handleAdditionalLineChange(e, entryIndex, lineIndex)}
                    />
                  </td>

                  <td>
                    <input
                      disabled={
                        entry.firstLine.directContra === "yes" ||
                        (entry.firstLine.directContra !== "yes" &&
                          (entry.firstLine.dr > 0 || entry.firstLine.dr < 0))
                      }
                      type="number"
                      className="form-control"
                      style={{ maxWidth: "15ch" }}
                      name="dr"
                      placeholder="0.00"
                      value={line.dr}
                      onChange={(e) => handleAdditionalLineChange(e, entryIndex, lineIndex)}
                    />
                  </td>

                  <td>
                    <input
                      disabled={
                        entry.firstLine.directContra === "yes" ||
                        (entry.firstLine.directContra !== "yes" &&
                          (entry.firstLine.cr > 0 || entry.firstLine.cr < 0))
                      }
                      type="number"
                      className="form-control"
                      style={{ maxWidth: "15ch" }}
                      name="cr"
                      placeholder="0.00"
                      value={line.cr}
                      onChange={(e) => handleAdditionalLineChange(e, entryIndex, lineIndex)}
                    />
                  </td>

                  <td>
                    <button
                      disabled={entry.additionalLines.length === 1}
                      className="btn btn-sm text-danger me-2"
                      onClick={() => removeAdditionalLine(entryIndex, lineIndex)}
                    >
                      <i className="material-icons">delete_outline</i>
                    </button>

                    {lineIndex === entry.additionalLines.length - 1 && (
                      <button
                        disabled={entry.firstLine.directContra === "yes"}
                        className="btn btn-sm btn-outline-info"
                        onClick={() => addAdditionalLine(entryIndex)}
                      >
                        <i className="material-icons">add</i>
                      </button>
                    )}
                  </td>

                  <td></td>
                </tr>
              ))}

              <tr>
                <td colSpan="8">
                  <br />
                </td>
              </tr>

              {entryIndex === entries.length - 1 && (
                <tr>
                  <td colSpan="8">
                    <button className="btn btn-sm btn-outline-info" onClick={addEntry}>
                      Add Entry
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="text-end">
        <button className="btn btn-info text-white" onClick={postData}>
          Post
        </button>
      </div>
    </div>
  );
}

GeneralJournal.layout = (page) => <Layout children={page} title={"General Journal"} />;
