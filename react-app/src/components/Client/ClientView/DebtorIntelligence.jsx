import { truncate } from "lodash";
import SectionSkeleton from "./SectionSkeleton.jsx";
import { friendlyDateAndTime } from "../../../utils/index.js";
import useDebtorIntelligence from "../../../hooks/component-hooks/useDebtorIntelligence.js";

export default function DebtorIntelligence({ data: initialData, clientId, isCreditorView }) {
  const { data, isEditMode, handleSave, loggedInUser, setIsEditMode, error, setError, isLoading } =
    useDebtorIntelligence(initialData, clientId, isCreditorView);

  return (
    <SectionSkeleton title={isCreditorView ? "creditor intelligence" : "customer intelligence"}>
      <div className="px-3 py-2">
        {error && (
          <p className="d-flex align-items-start gap-1 small text-danger">
            <button
              type="button"
              onClick={() => setError("")}
              className="btn-close btn-sm"
            ></button>

            {truncate(error, { length: 150 })}
          </p>
        )}

        {isEditMode ? (
          <form onSubmit={handleSave}>
            <div className="mb-2">
              <label htmlFor="note" className="form-label">
                {data && data.text ? "Edit note" : "No note found, create new note"}
              </label>

              <textarea
                className="form-control"
                name="note"
                id="note"
                rows="2"
                defaultValue={data && data.text ? data.text : ""}
                placeholder="type here..."
                disabled={isLoading}
              ></textarea>
            </div>

            <b className="d-block my-1">{loggedInUser}</b>

            <div className="small text-success">today</div>

            <button
              disabled={isLoading}
              type="submit"
              className="d-block btn btn-info text-white w-100 mt-3"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <div>
            <small>{data.text}</small>

            <b className="d-block my-1">{data.user}</b>

            <div className="small text-success">{friendlyDateAndTime(data.timestamp)}</div>

            <button
              onClick={() => setIsEditMode(true)}
              type="button"
              className="d-block btn btn-info w-100 mt-4 text-white"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </SectionSkeleton>
  );
}
