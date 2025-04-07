import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ConfirmEnquirerType = ({
  show,
  handleClose,
  setShowEnquirerInputDialog,
  handleShowReport,
}) => {
  return (
    <div className="container-xl p-5">
      <div className="card card-raised">
        <div className="card-body p-4">
          <Modal show={show} onHide={handleClose} size="md" backdrop="static" centered>
            <Modal.Header closeButton className="h4 text-center">
              <Modal.Title className="h6">Please choose the type of enquiry.</Modal.Title>
            </Modal.Header>
            <Modal.Footer className="p-4 d-flex justify-content-between gap-4">
              <Button
                variant="info"
                className="text-white"
                onClick={() => {
                  handleClose();
                  handleShowReport("internal");
                }}
              >
                Internal
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEnquirerInputDialog(true);
                  handleClose();
                }}
              >
                External
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEnquirerType;
