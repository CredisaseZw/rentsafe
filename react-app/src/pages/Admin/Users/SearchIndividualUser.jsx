import { useForm, usePage } from "@inertiajs/inertia-react";
// import axios from 'axios';
import React, { useState } from "react";
import DeleteUserConfirmation from "../../../components/Admin/DeleteUserConfirmition.jsx";
import BulkIconButton from "../../../components/BulkIconButton.jsx";
import IndividualAdd from "../../../components/Client/IndividualAdd.jsx";
// import { IndividualVerify } from '../../../components/Client/OTP/IndividualVerify.jsx';
import { NotFound } from "../../../components/NotFound.jsx";
import PageHeader from "../../../components/PageHeader.jsx";

export default function IndividualSearch() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [addSuccessful, setAddSuccessful] = useState(false);
  const handleShow = () => setShow(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editBtn, setEditBtn] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [userToActOn, setUserToActOn] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [errors, setErrors] = useState({});
  const { is_internal } = usePage().props.Auth;

  const { data, setData, post } = useForm({
    searchParam: "fullname",
    searchValue: "",
  });
  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (data.searchValue === "") {
      return setErrors({
        searchValue: "Please enter a search value",
      });
    }
    post(reverseUrl("search_individual_users"), {
      onStart: () => {
        setIsLoading(true);
        setEditBtn(false);
        setFetchedData([]);
        setErrors({});
      },
      onSuccess: (response) => {
        //This will return true if the object is empty, otherwise false
        const isObjectEmpty = (objectName) => {
          return JSON.stringify(objectName) === "{}";
        };
        if (response.props.result.length < 1) {
          setNotFound(true);
        } else {
          setFetchedData(response.props.result);
          setNotFound(false);
        }

        setIsLoading(false);
      },
      onError: (e) => {
        setIsLoading(false);
      },
    });
  };

  const handleSingle = () => {
    setIsSingle(true);
    setIsMultiple(false);
  };

  const handleMultiple = () => {
    setIsMultiple(true);
    setIsSingle(false);
  };
  return (
    <main>
      <PageHeader title={"Individual Users"} />
      <div className="container-xl p-5">
        <div className="row align-items-center mb-5">
          <div className="col-12 col-md-auto">
            <form className="mb-5" onSubmit={submitHandler}>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <div>
                  <label className="form-label" htmlFor="">
                    Filter by Full Name/ID
                  </label>
                  <input
                    value={data.searchValue}
                    onChange={(e) => {
                      changeHandler(e);
                      setNotFound(false);
                    }}
                    type="text"
                    name="searchValue"
                    id="searchValue"
                    className="form-control form-control"
                  />
                  {errors.searchValue && (
                    <small className="text-danger">{errors.searchValue}</small>
                  )}
                </div>
                <div>
                  <label className="form-label" htmlFor="">
                    Select filter Parameter
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="searchParam"
                    id="searchParam"
                    onChange={changeHandler}
                  >
                    <option value="fullname">Full name</option>
                    <option value="nationalid">National ID</option>
                  </select>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-raised-info text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    <i className="leading-icon material-icons">search</i>
                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">Searching..</span>
                      </>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <BulkIconButton />
                </div>
              </div>
            </form>
          </div>
        </div>
        {show && (
          <IndividualAdd
            show={show}
            isMultiple={isMultiple}
            isSingle={isSingle}
            handleMultiple={handleMultiple}
            handleSingle={handleSingle}
            handleClose={handleClose}
            setAddSuccessful={setAddSuccessful}
            action={"create"}
            url={is_internal !== 1 ? "client-create-individual" : "create-individual-user"}
          />
        )}
        {editBtn && (
          <IndividualAdd
            show={editBtn}
            handleClose={() => {
              setEditBtn(false);
              setUserToActOn({});
            }}
            isMultiple={isMultiple}
            isSingle={isSingle}
            handleMultiple={handleMultiple}
            handleSingle={handleSingle}
            setAddSuccessful={() => {}}
            setFetchedData={() => {}}
            action={"edit"}
            userDetails={userToActOn}
          />
        )}
        {deleteBtn && (
          <DeleteUserConfirmation
            url={"delete_individual_user"}
            handleClose={() => {
              setDeleteBtn(false);
              setUserToActOn({});
            }}
            show={deleteBtn}
            type={"individual"}
            setFetchedData={setFetchedData}
            userId={userToActOn.id}
            name={userToActOn.name}
          />
        )}
        {/* {addSuccessful && (
          <IndividualVerify
            show={addSuccessful}
            handleClose={() => {
              axios.get(reverseUrl('verify')).then((res) => {
                (() => {})();
              });
              setAddSuccessful(false);
            }}
            url={
              is_internal == 1
                ? 'individual_user_verify_otp'
                : 'client-individual-verify-otp'
            }
            verification_type={'individual'}
            setVerified={() => {}}
          />
        )} */}

        <div className="card card-raised">
          <div className="card-body p-4">
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
              <div className="datatable-container">
                <table className="table table-striped">
                  <tbody>
                    <tr style={{ backgroundColor: "#e4e4e4" }}>
                      <th scope="col">Forenames</th>
                      <th scope="col">surname</th>
                      <th scope="col">National ID</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>

                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">searching..</span>
                      </>
                    ) : (
                      fetchedData &&
                      fetchedData?.map(({ id, firstname, surname, identification_number }) => (
                        <tr key={id}>
                          <th scope="row">{firstname}</th>
                          <td>{surname}</td>
                          <td>{identification_number}</td>

                          {id ? (
                            <>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-raised text-info d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setEditBtn(true);
                                    setUserToActOn(fetchedData?.find((user) => user.id === id));
                                    setFetchedData([]);
                                  }}
                                >
                                  <i className="leading-icon material-icons">edit</i>
                                </button>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-raised text-danger d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setDeleteBtn(true);
                                    setUserToActOn({
                                      id,
                                      name: firstname + " " + surname,
                                    });
                                  }}
                                >
                                  <i className="leading-icon material-icons">delete</i>
                                </button>
                              </td>
                            </>
                          ) : null}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="row justify-content-center">
                  <div className="col-md-auto">
                    {notFound && (
                      <NotFound
                        handleShow={handleShow}
                        searchValue={data.searchValue}
                        handleCloseModal={() => setNotFound(false)}
                        userType="Individual"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="datatable-bottom">
                <div className="datatable-info"></div>
                <nav className="datatable-pagination"></nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
