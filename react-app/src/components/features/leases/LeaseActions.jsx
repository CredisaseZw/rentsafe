import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import LeaseForm from "./IndividualLeaseForm.jsx";
import DeleteLeaseConfirm from "./DeleteLeaseConfirm.jsx";

const LeaseActions = ({ show, handleClose, setAction, leaseDetails }) => {
  const [openForm, setOpenForm] = useState(false);
  const [btnAction, setBtnAction] = useState("");
  return (
    <div className="container-xl p-5">
      <div className="card card-raised">
        <div className="card-body p-4">
          <Modal show={show} onHide={handleClose} size="auto" backdrop="static" centered>
            <Modal.Header closeButton>
              <Modal.Title>Actions</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
              <Button
                onClick={() => {
                  setAction("view");
                  setBtnAction("view");
                  setOpenForm(true);
                }}
                variant="info"
              >
                <i className="material-icons">visibility</i>
                View
              </Button>
              <Button
                onClick={() => {
                  setAction("edit");
                  setBtnAction("edit");
                  setOpenForm(true);
                }}
                variant="primary"
              >
                <i className="material-icons">edit</i>
                Edit
              </Button>
              <Button
                onClick={() => {
                  setAction("delete");
                  setBtnAction("delete");
                  setOpenForm(true);
                }}
                variant="danger"
              >
                <i className="material-icons">close</i>
                Terminate
              </Button>
            </Modal.Body>
          </Modal>
          {openForm && btnAction === "view" && (
            <LeaseForm
              show={openForm}
              handleClose={() => {
                setOpenForm(false);
                handleClose();
              }}
              action={btnAction}
              lesseeDetails={leaseDetails}
            />
          )}
          {openForm && btnAction === "edit" && (
            <LeaseForm
              show={openForm}
              handleClose={() => {
                setOpenForm(false);
                handleClose();
              }}
              action={btnAction}
              lesseeDetails={leaseDetails}
            />
          )}
          {openForm && btnAction === "delete" && (
            <DeleteLeaseConfirm
              show={openForm}
              handleClose={() => {
                setOpenForm(false);
                handleClose();
              }}
              action={btnAction}
              lesseeDetails={leaseDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaseActions;
