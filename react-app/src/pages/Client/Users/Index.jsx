import Layout from "../../../components/Layouts/client/Layout.jsx";
import DeleteUser from "../../../components/modals/Client/DeleteUser.jsx";
import UserForm from "../../../components/modals/Client/UserForm.jsx";
import UserSearchModal from "../../../components/modals/Client/UserSearchModal.jsx";
import useInternalUsers from "../../../hooks/page-hooks/useInternalUsers.js";

export default function Index({ users }) {
  const { searchValue, filteredUsers, userModalOptions, setUserModalOptions, handleSearch } =
    useInternalUsers(users);

  return (
    <main>
      {userModalOptions?.type !== "" && (
        <>
          <UserForm
            key={JSON.stringify(userModalOptions.userToActOn)}
            show={userModalOptions.type === "user"}
            action={userModalOptions.action}
            user={userModalOptions.userToActOn}
            url={userModalOptions.action === "add" ? "create-user" : "edit-user"}
            handleClose={() => setUserModalOptions({ type: "", action: "", userToActOn: {} })}
          />

          <UserSearchModal
            show={userModalOptions.type === "add-internal-user"}
            handleClose={() => setUserModalOptions({ type: "", action: "", userToActOn: {} })}
            handleProceed={(userObj) =>
              setUserModalOptions({
                type: "user",
                action: "add",
                userToActOn: userObj,
              })
            }
          />

          <DeleteUser
            userData={userModalOptions.userToActOn}
            show={userModalOptions.type === "delete"}
            handleClose={() => setUserModalOptions({ type: "", action: "", userToActOn: {} })}
          />
        </>
      )}

      <h5 className="text-center p-2 mb-0 text-white bg-info">Internal Users</h5>

      <table className="table table-sm table-striped border bg-white ">
        <thead className="position-sticky c-table-top bg-white shadow-sm c-z-5">
          <tr className="c-bg-whitesmoke">
            <td colSpan={7}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="col-5 d-flex">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Full name or email..."
                    className="form-control custom-mx-w-4 rounded-0 rounded-start"
                  />
                  <div className="text-white custom-bg-grey rounded-end d-flex align-items-center px-2">
                    <i className="material-icons">search</i>
                  </div>
                </div>

                <button
                  className="btn btn-info text-white rounded-0 rounded-top rounded-top-5"
                  onClick={() =>
                    setUserModalOptions({
                      type: "add-internal-user",
                      action: "",
                      userToActOn: {},
                    })
                  }
                >
                  <i className="leading-icon material-icons">add</i>
                  Add User
                </button>
              </div>
            </td>
          </tr>

          <tr className="c-force-borders">
            <th className="ps-3">
              <div> Surname</div>
            </th>
            <th>
              <div>First Name </div>
            </th>
            <th>
              <div>Level </div>
            </th>
            <th>
              <div>Email </div>
            </th>
            <th>
              <div>Mobile Number </div>
            </th>
            <th className="text-end pe-3">
              <div>Actions </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers?.map((user) => (
            <tr key={user.userId}>
              <td className="text-capitalize ps-3">{user.lastName}</td>

              <td className="text-capitalize">{user.firstName}</td>

              <td className="text-capitalize">{user.access_level}</td>

              <td className="text-lowercase">{user.email}</td>

              <td>{user.mobile}</td>

              <td className="d-flex gap-2 justify-content-end pe-3">
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => {
                    setUserModalOptions({
                      type: "user",
                      action: "edit",
                      userToActOn: user,
                    });
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setUserModalOptions({
                      type: "delete",
                      action: "",
                      userToActOn: user,
                    });
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers?.length === 0 && searchValue ? (
        <p className="custom-mx-w-4 mx-auto p-4 border border-2 text-center border-info">
          This individual is not part of the user list. Click 'Add User' to start the process of
          adding a new Internal User
        </p>
      ) : (
        ""
      )}
    </main>
  );
}

Index.layout = (page) => <Layout children={page} title={"Users"} />;
