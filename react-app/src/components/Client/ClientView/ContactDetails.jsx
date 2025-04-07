import { truncate } from "lodash";
import useContactDetails from "../../../hooks/component-hooks/useContactDetails.js";
import SectionSkeleton from "./SectionSkeleton.jsx";

export default function ContactDetails({ data: initialData, clientId, isCreditorView, leaseId }) {
  const { data, isEditMode, handleSave, setIsEditMode, error, setError, isLoading } =
    useContactDetails(initialData, clientId, isCreditorView, leaseId);

  return (
    <SectionSkeleton title="contact details">
      <div className="py-2">
        {error && (
          <p className="d-flex align-items-start px-2 gap-1 small text-danger">
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
            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke">
              <label htmlFor="firstname" className="form-label small">
                First Name
              </label>
              <input
                type="text"
                className="form-control form-control-sm w-50 rounded-2"
                name="firstname"
                id="firstname"
                disabled={isLoading}
                defaultValue={
                  data && data.contactPerson ? data.contactPerson.trim().split(" ")[0] : ""
                }
              />
            </div>

            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom">
              <label htmlFor="surname" className="form-label small">
                Surname
              </label>
              <input
                type="text"
                className="form-control form-control-sm w-50 rounded-2"
                name="surname"
                id="surname"
                disabled={isLoading}
                defaultValue={
                  data && data.contactPerson ? data.contactPerson.trim().split(" ")[1] : ""
                }
              />
            </div>

            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke">
              <label htmlFor="sms_number" className="form-label small">
                SMS Number
              </label>
              <input
                type="text"
                className="form-control form-control-sm w-50 rounded-2"
                name="sms_number"
                id="sms_number"
                disabled={isLoading}
                defaultValue={data && data.smsNumber ? data.smsNumber : ""}
              />
            </div>

            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom">
              <label htmlFor="other_numbers" className="form-label small">
                Other Numbers
              </label>
              <input
                type="text"
                className="form-control form-control-sm w-50 rounded-2"
                name="other_numbers"
                id="other_numbers"
                disabled={isLoading}
                defaultValue={data && data.otherNumbers ? data.otherNumbers : ""}
              />
            </div>

            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke">
              <label htmlFor="email_address" className="form-label small">
                Email Address
              </label>
              <input
                type="email"
                className="form-control form-control-sm w-50 rounded-2"
                name="email_address"
                id="email_address"
                disabled={isLoading}
                defaultValue={data && data.emailAddress ? data.emailAddress : ""}
              />
            </div>

            <div className="d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom">
              <label htmlFor="address" className="form-label small">
                Address
              </label>
              <input
                type="text"
                className="form-control form-control-sm w-50 rounded-2"
                name="address"
                id="address"
                disabled={isLoading}
                defaultValue={data && data.address ? data.address : ""}
              />
            </div>

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
            <div className="d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke">
              <div style={{ width: "40%" }}>Contact Person: </div>
              <div style={{ width: "60%" }}>{data.contactPerson}</div>
            </div>

            <div className="d-flex gap-2 py-1 px-2 border-bottom">
              <div style={{ width: "40%" }}>SMS Number: </div>
              <div style={{ width: "60%" }}>{data.smsNumber}</div>
            </div>

            <div className="d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke">
              <div style={{ width: "40%" }}>Other Numbers: </div>
              <div style={{ width: "60%" }}>{data.otherNumbers}</div>
            </div>

            <div className="d-flex gap-2 py-1 px-2 border-bottom">
              <div style={{ width: "40%" }}>Email Address: </div>
              <div style={{ width: "60%" }}>{data.emailAddress}</div>
            </div>

            <div className="d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke">
              <div style={{ width: "40%" }}>Address: </div>
              <div style={{ width: "60%" }}>{data.address}</div>
            </div>

            <div className="mt-4 px-2">
              <button
                onClick={() => setIsEditMode(true)}
                type="button"
                className="d-block btn btn-info w-100 text-white"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionSkeleton>
  );
}
