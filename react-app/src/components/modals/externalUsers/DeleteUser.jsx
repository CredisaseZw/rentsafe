import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useForm } from '@inertiajs/inertia-react';

const DeleteUser = ({ show, handleClose, userData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, post } = useForm({
    userId: userData.userId,
  });

  const handleDelete = () => {
    post(reverseUrl('destroy-user'), {
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        toast.success('User deleted successfully');
        setIsLoading(false);
        handleClose();
      },
      onError: (e) => {
        toast.error('Something went wrong! Please try again');
        setIsLoading(false);
      },
    });
    handleClose();
  };
  return (
    <div className="container-xl p-5">
      <div className="card card-raised">
        <div className="card-body p-4">
          <Modal
            show={show}
            onHide={handleClose}
            size="md"
            backdrop="static"
            centered
          >
            <Modal.Header
              closeButton
              className="h4 bg-info text-white text-center text-uppercase"
            >
              Confirm Delete User
            </Modal.Header>
            <Modal.Body className="p-4 d-flex justify-content-between align-items-center gap-4">
              <p className="my-3 text-center">
                Are you sure you want to delete {userData.firstName}{' '}
                {userData.lastName} from the system? This action cannot be
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
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
