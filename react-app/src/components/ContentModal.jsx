import { Modal } from "react-bootstrap";

export default function ContentModal({
  show,
  handleClose,
  children,
  size,
  backdrop,
  title,
  titleOverideContent,
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={size || "xl"}
      backdrop={backdrop || "static"}
      centered
    >
      <Modal.Header closeButton onHide={handleClose}>
        <div>{titleOverideContent || <h4>{title}</h4>}</div>
      </Modal.Header>

      <Modal.Body>
        <div>{children}</div>
      </Modal.Body>
    </Modal>
  );
}
