import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useForm } from "@inertiajs/inertia-react";

const TerminateLease = ({ show, handleClose, leaseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, post } = useForm({
    leaseId: leaseData.lease_id,
  });

  const handleDelete = () => {
    post(reverseUrl("delete_lease"), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        toast.success(JSON.stringify("Lease terminated successfully"));
        setIsLoading(false);
      },
      onError: (e) => {
        toast.error("Something went wrong! Please try again");
        setIsLoading(false);
      },
      onFinish: () => {
        handleClose();
      },
    });
  };
  return (
    <Modal show={show} onHide={handleClose} size="md" backdrop="static" centered>
      <Modal.Header closeButton className="h4 bg-info text-white text-center text-uppercase">
        Confirm Lease Termination
      </Modal.Header>
      <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
        <p className="my-3 text-center">
          Are you sure you want to terninate lease for {leaseData.name}? This action cannot be
          undone.
        </p>
      </Modal.Body>
      <Modal.Footer className="p-4 d-flex justify-content-end gap-4">
        <Button onClick={handleClose} variant="secondary">
          <i className="material-icons">cancel</i>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="danger">
          <i className="material-icons">done</i>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TerminateLease;
