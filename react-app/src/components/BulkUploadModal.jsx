import React from "react";
import { MultipleUpload } from "./MultipleUpload.jsx";
import { Modal } from "react-bootstrap";

export default function BulkUploadModal({ type, actionType, show, handleClose }) {
  return (
    <div>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <div>
          <div className="card card-raised">
            <Modal.Header closeButton className="card-header bg-info px-4">
              <div
                className="d-flex justify-content-between
                            align-items-center"
              >
                <div className="me-4">
                  <div className="card-text"></div>
                </div>
                <div className="d-flex gap-2"></div>
              </div>
            </Modal.Header>
            <div className="card-body p-4">
              <div className="card">
                <div
                  className="card-body p-4"
                  style={{
                    borderStyle: "solid",
                    borderColor: "#26a69a",
                  }}
                >
                  <Modal.Body>
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="row">
                          <MultipleUpload type={type} actionType={actionType} />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
