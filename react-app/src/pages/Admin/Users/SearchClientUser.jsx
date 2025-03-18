import { useForm, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CompanyAdd } from "../../../components/Admin/CompanyAdd.jsx";
import DeleteUserConfirmation from "../../../components/Admin/DeleteUserConfirmition.jsx";
import { NotFound } from "../../../components/NotFound.jsx";
import PageHeader from "../../../components/PageHeader.jsx";

export default function CompanySearch() {
  const [addSuccessful, setAddSuccessful] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnAdd, setBtnAdd] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isSingle, setIsSingle] = useState(true);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [userToActOn, setUserToActOn] = useState({});
  const [editBtn, setEditBtn] = useState(false);
  const [errors, setErrors] = useState({});
  const { is_internal } = usePage().props.Auth;

  const handleSingle = () => {
    setIsSingle(true);
    setIsMultiple(false);
  };

  const handleMultiple = () => {
    setIsMultiple(true);
    setIsSingle(false);
  };

  const { data, setData, post } = useForm({
    searchParam: "registration_name",
    searchValue: "",
  });

  const changeHandler = (e) => setData(e.target.name, e.target.value);
  const submitHandler = (e) => {
    e.preventDefault();
    if (data.searchValue === "") {
      setErrors({
        searchValue: "Please enter a search value",
      });
      setBtnAdd(false);
      return;
    }
    post(reverseUrl("search_contracted_companies"), {
      onStart: () => {
        setIsLoading(true);
        setBtnAdd(false);
        setErrors({});
        setFetchedData({});
      },
      onSuccess: (response) => {
        //This will return true if the object is empty, otherwise false
        const isObjectEmpty = (objectName) => {
          return JSON.stringify(objectName) === "{}";
        };
        console.log(response.props.result.length);
        if (response.props.result.length > 0) {
          console.log(response.props.result);
          setFetchedData(response.props.result);
        } else {
          setBtnAdd(true);
        }
        setIsLoading(false);
      },
      onError: (e) => {
        toast.error("Nothing to search...");

        setIsLoading(false);
      },
    });
  };

  return (
    <main>
      <PageHeader title={"Client Users"} />
      <div className="container-xl p-5">
        <div className="row align-items-center mb-5">
          <div className="col-12 col-md-auto">
            <form className="mb-5" onSubmit={submitHandler}>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <div>
                  <label className="form-label" htmlFor="">
                    Filter by Reg. Number / Name
                  </label>
                  <input
                    value={data.searchValue}
                    onChange={changeHandler}
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
                    <option value="registration_name">Registration Name</option>
                    <option value="registration_number">Registration Number</option>
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
              </div>
            </form>
          </div>
        </div>
        <CompanyAdd
          setFetchedData={setFetchedData}
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          isSingle={isSingle}
          handleSingle={handleSingle}
          isMultiple={isMultiple}
          handleMultiple={handleMultiple}
          setAddSuccessful={setAddSuccessful}
          action={"create"}
          url={is_internal !== 1 ? "client-create-company" : "create-company"} // user type 1 is client
        />
        <div className="card card-raised">
          <div className="card-body p-4">
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
              <div className="datatable-container">
                <table className="table table-striped">
                  <tbody>
                    <tr style={{ backgroundColor: "#e4e4e4" }}>
                      <th scope="col">Registration Name</th>
                      <th scope="col">Registration Number</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>

                    {isLoading ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm"></span>
                        <span className="ml-2">searching..</span>
                      </>
                    ) : fetchedData?.length > 0 ? (
                      fetchedData?.map(({ id, registration_number, registration_name }) => {
                        return (
                          <tr key={id}>
                            <th scope="row">{registration_name}</th>
                            <td>{registration_number}</td>
                            <td>
                              {id ? (
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
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              {id ? (
                                <button
                                  type="button"
                                  className="btn btn-raised text-danger d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setDeleteBtn(true);
                                    setUserToActOn({
                                      id,
                                      name: registration_name,
                                    });
                                  }}
                                >
                                  <i className="leading-icon material-icons">delete</i>
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
                {/* Modal component */}

                <div className="row justify-content-center">
                  <div className="col-md-auto">
                    {btnAdd && (
                      <NotFound
                        handleShow={handleShow}
                        handleCloseModal={() => {
                          setBtnAdd(false);
                          data.searchValue = "";
                        }}
                        userType={"company"}
                        searchValue={data.searchValue}
                      />
                    )}
                    {deleteBtn && (
                      <DeleteUserConfirmation
                        url={"delete_company_user"}
                        handleClose={() => {
                          setDeleteBtn(false);
                          setUserToActOn({});
                        }}
                        show={deleteBtn}
                        type={"company"}
                        setFetchedData={setFetchedData}
                        userId={userToActOn.id}
                        name={userToActOn.name}
                      />
                    )}
                    {editBtn && (
                      <CompanyAdd
                        show={editBtn}
                        handleClose={() => {
                          setEditBtn(false);
                          setUserToActOn({});
                        }}
                        handleShow={() => {}}
                        isSingle={isSingle}
                        handleSingle={handleSingle}
                        isMultiple={isMultiple}
                        handleMultiple={handleMultiple}
                        setAddSuccessful={setAddSuccessful}
                        action={"edit"}
                        url={is_internal !== 1 ? "edit_company_user" : "client-edit-company"}
                        companyData={userToActOn}
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
