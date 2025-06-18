import Layout from "../../../components/Layouts/client/Layout.jsx";
import DeleteUser from "../../../components/modals/Client/DeleteUser.jsx";
import UserForm from "../../../components/modals/Client/UserForm.jsx";
import UserSearchModal from "../../../components/modals/Client/UserSearchModal.jsx";
import useInternalUsers from "../../../hooks/page-hooks/useInternalUsers.js";
import * as CustomTable from "../../../components/Client/table/CustomTable.jsx";
import { capitalize } from "lodash";

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

      <CustomTable.Table tabletitle="Internal Users" tabletitleBg="info" tabletitleColor="white">
        <CustomTable.ColGroup ratios={[null, null, 1, null, 1, 1]} />

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <td colSpan={7}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="col-5 d-flex">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Full name or email..."
                    className="form-control form-control-sm custom-mx-w-3 rounded-0 border-dark"
                  />
                  <div className="border border-dark border-start-0 bg-light rounded-end d-flex align-items-center px-2">
                    <i className="material-icons small">search</i>
                  </div>
                </div>

                <CustomTable.ActionButtonTemplate
                  icon="add"
                  onClick={() =>
                    setUserModalOptions({ type: "add-internal-user", action: "", userToActOn: {} })
                  }
                >
                  Add User
                </CustomTable.ActionButtonTemplate>
              </div>
            </td>
          </tr>

          <tr>
            <th>Surname</th>
            <th>First Name</th>
            <th>Level</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers?.map((user) => (
            <tr key={user.userId}>
              <td>{capitalize(user.lastName)}</td>

              <td>{capitalize(user.firstName)}</td>

              <td className="text-lowercase">{user.access_level}</td>

              <td className="text-lowercase">{user.email}</td>

              <td>{user.mobile}</td>

              <td>
                <CustomTable.ActionButtonsContainer>
                  <CustomTable.ActionButtonTemplate
                    onClick={() => {
                      setUserModalOptions({ type: "user", action: "edit", userToActOn: user });
                    }}
                  >
                    Edit
                  </CustomTable.ActionButtonTemplate>

                  <CustomTable.ActionButtonTemplate
                    variant="danger"
                    onClick={() => {
                      setUserModalOptions({ type: "delete", action: "", userToActOn: user });
                    }}
                  >
                    Delete
                  </CustomTable.ActionButtonTemplate>
                </CustomTable.ActionButtonsContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </CustomTable.Table>

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
