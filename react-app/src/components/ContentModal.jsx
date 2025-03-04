import { Modal } from 'react-bootstrap';

export default function ContentModal({
  show,
  handleClose,
  children,
  size,
  backdrop,
  title,
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={size || 'xl'}
      backdrop={backdrop || 'static'}
      centered
    >
      <Modal.Header>
        <div className="w-100 p-3 position-relative">
          <h4 className="text-center">{title}</h4>

          <button
            type="button"
            onClick={handleClose}
            className="btn btn-danger btn-sm position-absolute end-0 top-0 m-3"
          >
            <i className="material-icons">close</i>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div>{children}</div>
      </Modal.Body>
    </Modal>
  );
}
