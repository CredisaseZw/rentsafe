import { Modal } from "react-bootstrap";

export default function DismissInvoice({ show, invoice, confirmDismissal, handleClose }) {
  return (
    <Modal centered size="md" backdrop="static" show={show} onHide={handleClose}>
      <Modal.Header closeButton className="h4 bg-info text-white text-center text-uppercase">
        Confirm Invoice Dismissal
      </Modal.Header>

      <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
        <p className="my-3">
          Are you sure you want to dismiss invoice for {invoice.tenant_name}? No invoice amount or
          record will be posted for the customer for the month.
        </p>
      </Modal.Body>

      <Modal.Footer className="p-4 d-flex justify-content-end gap-4">
        <button onClick={handleClose} className="btn btn-light gap-2">
          <i className="material-icons">cancel</i>
          Cancel
        </button>
        <button onClick={confirmDismissal} className="btn btn-danger gap-2">
          <i className="material-icons">done</i>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
}
