import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteLeaseConfirm = ({ show, handleClose }) => {
  return (
    <div className="container-xl p-5">
      <div className="card card-raised">
        <div className="card-body p-4">
          <Modal show={show} onHide={handleClose} size="md" backdrop="static" centered>
            <Modal.Header closeButton className="h4 bg-info text-white text-center text-uppercase">
              Confirm Termination of Lease
            </Modal.Header>
            <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
              <p className="my-3 text-center">
                Are you sure you want to terminate this lease? This action cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer className="p-4 d-flex justify-content-end gap-4">
              <Button onClick={handleClose} variant="secondary">
                <i className="material-icons">cancel</i>
                Cancel
              </Button>
              <Button onClick={handleClose} variant="danger">
                <i className="material-icons">done</i>
                Terminate
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DeleteLeaseConfirm;
