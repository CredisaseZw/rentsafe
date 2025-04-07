import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteUserConfirmation = ({
  url,
  handleClose,
  show,
  type,
  userId,
  name,
  setFetchedData,
  setAllAgents,
}) => {
  let data = {};
  if (type === "company") {
    data = {
      company_id: userId,
    };
  } else if (type === "individual" || type === "agent") {
    data = {
      individual_id: userId,
    };
  }
  const handleDelete = () => {
    axios
      .post(reverseUrl(url), { ...data })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(`User ${name} deleted successfully`);
          setFetchedData((prev) => prev?.filter((user) => user.id !== userId));
          setAllAgents((prev) => prev?.filter((user) => user.id !== userId));
          handleClose();
        } else {
          toast.error("Something went wrong! Please try again");
          handleClose();
        }
      })
      .catch((e) => {
        toast.error("Something went wrong! Please try again");
        handleClose();
      });
  };

  return (
    <div className="container-xl p-5">
      <div className="card card-raised">
        <div className="card-body p-4">
          <Modal show={show} onHide={handleClose} size="sm" backdrop="static" centered>
            <Modal.Header closeButton className="h4 bg-info text-white text-center text-uppercase">
              <Modal.Title className="text-white">Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
              Are you sure you want to delete {type} {name}?
            </Modal.Body>
            <Modal.Footer className="p-4 d-flex justify-content-end gap-4">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserConfirmation;
