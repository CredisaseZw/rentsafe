import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomAsyncSelect from "../../CustomAsyncSelect.jsx";

export default function UserSearchModal({ show, handleClose, handleProceed }) {
  const [user, setUser] = useState();

  function handleUserChange(res) {
    setUser({
      userId: res.id,
      firstName: res.firstname,
      lastName: res.surname,
      identificationNumber: res.national_id,
      identificationType: "nationalid",
      // email: 'client@client.com',
      // mobile: '263779586059',
      // address: '2312 Chiredzi',
      // access_level: 'admin',
    });
  }

  return (
    <Modal size="md" backdrop="static" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-info">
        <h3 className="mb-0 text-white">Add Internal User</h3>
      </Modal.Header>

      <Modal.Body>
        <div className="custom-mn-h-3 py-5 px-4 mt-4">
          <div className="d-flex gap-2 py-4">
            <CustomAsyncSelect
              onChange={(res) => handleUserChange(res)}
              extraProps={{
                className: "flex-grow-1",
                placeholder: "ID number or full name...",
              }}
              useAlternateFetchOptions={{
                type: "individual",
              }}
              noOptionsMessage={() => (
                <p className="m-0 text-center">
                  No search results found. Please add this individual's details by clicking
                  <br />
                  <button
                    type="button"
                    className="btn btn-info btn-sm text-white mt-2"
                    onClick={() => {
                      handleProceed({});
                    }}
                  >
                    Ok
                  </button>
                </p>
              )}
            />

            {Boolean(user?.userId) ? (
              <button
                className="btn btn-info text-white c-w-fit"
                onClick={() => handleProceed(user)}
              >
                Proceed
              </button>
            ) : (
              <div className="text-white bg-info d-flex align-items-center px-2">
                <i className="material-icons">search</i>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
