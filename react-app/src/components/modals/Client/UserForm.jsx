import { Modal } from 'react-bootstrap';
import useUserForm from '../../../hooks/page-hooks/useUserForm';

export default function UserForm({ show, handleClose, action, user, url }) {
  const { data, errors, isLoading, handleSubmit, changeHandler } = useUserForm(
    user,
    url,
    action,
    handleClose
  );

  return (
    <Modal
      size="lg"
      backdrop="static"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton className="bg-info">
        <h3 className="mb-0 text-white">
          {action === 'add'
            ? user?.userId
              ? 'Add Internal User'
              : 'Add New User'
            : 'Update User'}
        </h3>
      </Modal.Header>

      <Modal.Body>
        <form
          onSubmit={handleSubmit}
          className="border border-3 border-info p-4 mt-4"
        >
          <div className="row row-cols-3 mb-4">
            <div>
              <label className="form-label">Surname</label>
              <input
                value={data.lastName}
                onChange={changeHandler}
                type="text"
                placeholder="Surname"
                required
                name="lastName"
                id="lastName"
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">{errors.lastName}</div>
              )}
            </div>

            <div>
              <label className="form-label">First Name</label>
              <input
                value={data.firstName}
                onChange={changeHandler}
                type="text"
                placeholder="First Name"
                required
                name="firstName"
                id="firstName"
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">{errors.firstName}</div>
              )}
            </div>

            <div>
              <label className="form-label">Identification Type</label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="identificationType"
                required
                id="identificationType"
                onChange={changeHandler}
                value={data.identificationType}
              >
                <option>Select Type...</option>
                <option value="nationalid">National ID</option>
                <option value="passport">Passport</option>
                <option value="servicesid">Service ID</option>
              </select>
              {errors && (
                <div className="text-danger small mt-1">
                  {errors.identificationType}
                </div>
              )}
            </div>
          </div>

          <div className="row row-cols-3 mb-4">
            <div>
              <label className="form-label">Identification Number</label>
              <input
                value={data.identificationNumber}
                onChange={changeHandler}
                type="text"
                required
                placeholder="Identification Number"
                name="identificationNumber"
                id="identificationNumber"
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">
                  {errors.identificationNumber}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Address</label>
              <textarea
                value={data.address}
                onChange={changeHandler}
                type="text"
                placeholder="Address"
                id="address"
                required
                name="address"
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">{errors.address}</div>
              )}
            </div>

            <div>
              <label className="form-label">Mobile Number</label>
              <input
                value={data.mobileNumber}
                onChange={changeHandler}
                required
                placeholder="Mobile Number"
                type="text"
                name="mobileNumber"
                id="mobileNumber"
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">
                  {errors.mobileNumber}
                </div>
              )}
            </div>
          </div>

          <div className="row row-cols-3 mb-4">
            <div>
              <label className="form-label">Access Level</label>
              <select
                value={data.accessLevel}
                onChange={changeHandler}
                id="accessLevel"
                required
                name="accessLevel"
                className="form-select"
              >
                <option value="" disabled>
                  Select Level...
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors && (
                <div className="text-danger small mt-1">
                  {errors.accessLevel}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">User Email</label>
              <input
                value={data.userEmail}
                onChange={changeHandler}
                type="email"
                name="userEmail"
                placeholder="eg. joe@rentsafe.com"
                id="userEmail"
                required
                className="form-control"
              />
              {errors && (
                <div className="text-danger small mt-1">{errors.userEmail}</div>
              )}
            </div>
          </div>

          <div className="text-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-info text-white"
            >
              {isLoading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm me-2"></span>
                  <span className="ml-2">processing..</span>
                </>
              ) : action === 'add' ? (
                'Add User'
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
