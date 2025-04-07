import { Modal } from "react-bootstrap";

export default function ContentModal({
  show,
  centerTitle,
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
        <div className="w-100 pt-4">
          {titleOverideContent || <h4 className={centerTitle ? "text-center" : ""}>{title}</h4>}
        </div>
      </Modal.Header>

      <Modal.Body>
        <div>{children}</div>
      </Modal.Body>
    </Modal>
  );
}
