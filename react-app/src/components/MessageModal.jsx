import { Modal } from "react-bootstrap";

export default function MessageModal({
  show,
  handleClose,
  message,
  size,
  backdrop,
  title,
  actionButtons,
}) {
  return (
    <Modal show={show} onHide={handleClose} size={size || "md"} backdrop={backdrop} centered>
      <Modal.Header>
        <div className="w-100 p-3 position-relative">
          <h4 className="text-center">{title}</h4>

          {/* <button
            type="button"
            onClick={handleClose}
            className="btn btn-danger btn-sm position-absolute end-0 top-0 m-3"
          >
            <i className="material-icons">close</i>
          </button> */}
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">{message}</div>
      </Modal.Body>

      <Modal.Footer className="justify-content-center gap-2 mb-4">
        {actionButtons && actionButtons}
      </Modal.Footer>
    </Modal>
  );
}
